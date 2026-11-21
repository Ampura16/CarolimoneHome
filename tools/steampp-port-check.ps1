#requires -Version 5.1
<#
.SYNOPSIS
    诊断 Steam++（Watt Toolkit）hosts 劫持、443 端口占用与本地代理冲突。

.DESCRIPTION
    只读脚本，不需要管理员权限。输出四部分信息并给出下一步建议：
      1. hosts 中 Steam++ 写入的域名段（以及目标域名是否被指向 127.0.0.1）
      2. 目标域名当前 DNS 解析结果
      3. 80/443/7890/1080/8080 的监听地址与占用进程
      4. 本地代理端口连通性 + 结论建议

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\tools\steampp-port-check.ps1

.EXAMPLE
    .\tools\steampp-port-check.ps1 -Ports 443,7890 -Json

.NOTES
    兼容 Windows PowerShell 5.1（无需 PowerShell 7）。
    文件含中文，必须保存为 UTF-8 with BOM，否则 5.1 会按 ANSI 解析并报语法错误。
    只读脚本：不修改 hosts、不结束进程、不修改系统设置。
#>
[CmdletBinding()]
param(
    [int[]]$Ports = @(80, 443, 7890, 1080, 8080),
    [string]$HostsPath = (Join-Path $env:SystemRoot 'System32\drivers\etc\hosts'),
    [string[]]$Targets = @('github.com', 'api.github.com'),
    [switch]$Json
)

$ErrorActionPreference = 'Stop'

function Get-SteamHostsInfo {
    param([string]$Path, [string[]]$Domains)

    $info = [ordered]@{
        Path            = $Path
        Readable        = $false
        BlockFound      = $false
        BlockEntries    = @()
        TargetOverrides = @()
    }
    if (-not (Test-Path -LiteralPath $Path)) { return [pscustomobject]$info }

    try {
        $lines = Get-Content -LiteralPath $Path -ErrorAction Stop
        $info.Readable = $true
    } catch {
        return [pscustomobject]$info
    }

    $inBlock = $false
    $blocked = New-Object System.Collections.Generic.List[string]
    foreach ($line in $lines) {
        if ($line -match '^\s*#\s*Steam\+\+\s+Start') { $inBlock = $true; $info.BlockFound = $true; continue }
        if ($line -match '^\s*#\s*Steam\+\+\s+End') { $inBlock = $false; continue }

        if ($line -match '^\s*([0-9a-fA-F:.]+)\s+(\S+)') {
            $ip = $Matches[1]
            $name = $Matches[2]
            if ($inBlock) { $blocked.Add($name) }
            foreach ($d in $Domains) {
                if ($name -ieq $d -and ($ip -eq '127.0.0.1' -or $ip -eq '::1')) {
                    $info.TargetOverrides += [pscustomobject]@{ Domain = $d; IP = $ip; InSteamBlock = $inBlock }
                }
            }
        }
    }
    $info.BlockEntries = $blocked.ToArray()
    return [pscustomobject]$info
}

function Get-DnsAnswer {
    param([string]$Name)
    try {
        $answers = Resolve-DnsName -Name $Name -Type A -ErrorAction Stop |
            Where-Object { $_.IPAddress } |
            Select-Object -ExpandProperty IPAddress -Unique
        if ($answers) { return @($answers) }
        return @()
    } catch {
        return @()
    }
}

function Get-ListenerTable {
    param([int[]]$ListenPorts)

    $rows = @()
    try {
        $rows = Get-NetTCPConnection -State Listen -ErrorAction Stop |
            Where-Object { $ListenPorts -contains $_.LocalPort } |
            ForEach-Object {
                $procId = $_.OwningProcess
                $pname = '?'
                $exe = ''
                try {
                    $proc = Get-Process -Id $procId -ErrorAction Stop
                    $pname = $proc.ProcessName
                    try { $exe = $proc.Path } catch { $exe = '' }
                } catch {
                    try {
                        $ci = Get-CimInstance Win32_Process -Filter "ProcessId=$procId" -ErrorAction Stop
                        if ($ci) { $pname = $ci.Name; if ($ci.ExecutablePath) { $exe = $ci.ExecutablePath } }
                    } catch { }
                    if ($pname -eq '?') {
                        try {
                            $tl = & tasklist /FI "PID eq $procId" /FO CSV /NH 2>$null
                            if ($tl -match '^"([^"]+)"') { $pname = $Matches[1] }
                        } catch { }
                    }
                }
                if ($pname -eq '?') { $pname = '(不可见)' }
                [pscustomobject]@{
                    Port    = $_.LocalPort
                    Address = $_.LocalAddress
                    PID     = $procId
                    Process = $pname
                    Path    = $exe
                }
            }
    } catch {
        # 老系统回退到 netstat
        $netstat = & netstat -ano 2>$null
        foreach ($line in $netstat) {
            if ($line -match '^\s*TCP\s+(\S+):(\d+)\s+\S+\s+LISTENING\s+(\d+)') {
                $port = [int]$Matches[2]
                if ($ListenPorts -contains $port) {
                    $rows += [pscustomobject]@{
                        Port = $port; Address = $Matches[1]; PID = [int]$Matches[3]; Process = '?'; Path = ''
                    }
                }
            }
        }
    }
    return @($rows | Sort-Object Port, Address)
}

function Test-LocalPort {
    param([int]$Port, [int]$TimeoutMs = 800)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $iar = $client.BeginConnect('127.0.0.1', $Port, $null, $null)
        $ok = $iar.AsyncWaitHandle.WaitOne($TimeoutMs, $false)
        if (-not $ok) { $client.Close(); return $false }
        $client.EndConnect($iar)
        $client.Close()
        return $true
    } catch {
        return $false
    }
}

function Test-IsSteamProcess {
    param([string]$Name)
    if (-not $Name) { return $false }
    return ($Name -match '(?i)steam(\+\+|-?plusplus)?$|watt|steamtools')
}

# ---------------------------------------------------------------------------
# 采集
# ---------------------------------------------------------------------------
$hosts     = Get-SteamHostsInfo -Path $HostsPath -Domains $Targets
$dns       = [ordered]@{}
foreach ($t in $Targets) { $dns[$t] = Get-DnsAnswer -Name $t }
$listeners = @(Get-ListenerTable -ListenPorts $Ports)
$portOpen  = @{}
foreach ($p in $Ports) { $portOpen[[string]$p] = Test-LocalPort -Port $p }

$githubLoopback = $false
if ($dns.Contains('github.com') -and $dns['github.com']) {
    $githubLoopback = ($dns['github.com'] -contains '127.0.0.1') -or ($dns['github.com'] -contains '::1')
}

$listen443 = @($listeners | Where-Object { $_.Port -eq 443 })
$steam443  = @($listen443 | Where-Object { Test-IsSteamProcess -Name $_.Process })
$other443  = @($listen443 | Where-Object { -not (Test-IsSteamProcess -Name $_.Process) })
$listen7890 = @($listeners | Where-Object { $_.Port -eq 7890 })
$hostsTargetHijack = @($hosts.TargetOverrides).Count -gt 0
$hijacked = $githubLoopback -or $hostsTargetHijack

# ---------------------------------------------------------------------------
# 输出
# ---------------------------------------------------------------------------
if ($Json) {
    [pscustomobject]@{
        Hosts           = $hosts
        Dns             = $dns
        Listeners       = $listeners
        PortOpen        = $portOpen
        GithubLoopback  = $githubLoopback
        HostsHijack     = $hostsTargetHijack
        Hijacked        = $hijacked
    } | ConvertTo-Json -Depth 6
    return
}

function Write-Section {
    param([string]$Title)
    Write-Host ''
    Write-Host ("== " + $Title + " " + ('=' * [Math]::Max(0, 60 - $Title.Length))) -ForegroundColor Cyan
}

Write-Section 'hosts 文件'
Write-Host ("路径: " + $hosts.Path)
if (-not $hosts.Readable) {
    Write-Host '  [x] 无法读取（可能需要管理员权限，或文件不存在）' -ForegroundColor Red
} else {
    if ($hosts.BlockFound) {
        Write-Host ("  [!] 发现 Steam++ 托管段，共 " + $hosts.BlockEntries.Count + " 条域名") -ForegroundColor Yellow
        $preview = $hosts.BlockEntries | Select-Object -First 8
        foreach ($h in $preview) { Write-Host ("      " + $h) }
        if ($hosts.BlockEntries.Count -gt 8) { Write-Host ("      ... 另 " + ($hosts.BlockEntries.Count - 8) + " 条") }
    } else {
        Write-Host '  [ok] 未发现 "# Steam++ Start ... # Steam++ End" 段' -ForegroundColor Green
    }
    if ($hostsTargetHijack) {
        foreach ($o in $hosts.TargetOverrides) {
            $mark = if ($o.InSteamBlock) { 'Steam++ 段内' } else { '段外手改' }
            Write-Host ("  [!] " + $o.Domain + " -> " + $o.IP + " (" + $mark + ")") -ForegroundColor Yellow
        }
    } else {
        Write-Host '  [ok] 目标域名未被 hosts 指向 127.0.0.1' -ForegroundColor Green
    }
}

Write-Section 'DNS 解析'
foreach ($t in $Targets) {
    $ans = $dns[$t]
    if ($ans -and $ans.Count -gt 0) {
        Write-Host ("  " + $t + " -> " + ($ans -join ', '))
    } else {
        Write-Host ("  " + $t + " -> 解析失败") -ForegroundColor Red
    }
}

Write-Section ('端口监听 (' + ($Ports -join ', ') + ')')
if ($listeners.Count -eq 0) {
    Write-Host '  没有任何监听' -ForegroundColor Gray
} else {
    $listeners | Format-Table -AutoSize Port, Address, PID, Process, Path | Out-String -Width 200 | Write-Host
}
foreach ($p in $Ports) {
    $state = if ($portOpen[[string]$p]) { '可连接' } else { '不可连接' }
    $color = if ($portOpen[[string]$p]) { 'Green' } else { 'Gray' }
    Write-Host ("  127.0.0.1:" + $p + " => " + $state) -ForegroundColor $color
}

Write-Section '结论与建议'
$advice = New-Object System.Collections.Generic.List[string]
if ($hijacked -and $listen443.Count -eq 0) {
    $advice.Add('hosts 仍把 github.com 指向 127.0.0.1，但 443 没有监听：Steam++ 反代已退出/崩溃。')
    $advice.Add('  -> 方案 A：退出并重启 Steam++，或在设置里关闭「GitHub 加速」后清理 hosts 段。')
    $advice.Add('  -> 方案 C：若机器上 7890 代理可用，用 git -c http.proxy=http://127.0.0.1:7890 绕过 hosts。')
} elseif ($hijacked -and $steam443.Count -gt 0) {
    $advice.Add('Steam++ 反代正在 443 提供服务（hosts 指向本机）。')
    $advice.Add('  -> 方案 B：git 报证书错误时，用 http.sslBackend=openssl + 含 SteamTools CA 的 sslCAInfo。')
} elseif ($hijacked -and $other443.Count -gt 0) {
    $advice.Add('443 被非 Steam++ 进程占用，Steam++ 加速实际失效。')
    $advice.Add('  -> 方案 D：结束/迁移占用进程，或退出 Steam++ 清理 hosts，避免连接被劫持到无关服务。')
} elseif (-not $hijacked -and $listen443.Count -gt 0) {
    $advice.Add('hosts 未被劫持，但 443 有进程监听：确认是否其他代理/服务占用该端口。')
} else {
    $advice.Add('hosts 与 443 状态正常，问题不在这两处，按普通网络故障排查。')
}

if ($listen7890.Count -gt 0 -and -not ($hijacked -and $steam443.Count -gt 0)) {
    $advice.Add('检测到 7890 代理可用（可作为替代）：')
    $advice.Add('    git -c http.sslBackend=openssl -c http.proxy=http://127.0.0.1:7890 push origin master')
}

$advice.Add('改完 hosts 后执行: ipconfig /flushdns')
$advice.Add('完整排查手册: docs/steampp-port-workflow.md')
foreach ($a in $advice) { Write-Host ('  ' + $a) }

Write-Host ''
