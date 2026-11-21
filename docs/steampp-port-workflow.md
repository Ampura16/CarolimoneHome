# Steam++（Watt Toolkit）端口占用与 GitHub 访问故障 工作方法

> 适用对象：Windows 上同时装了 Steam++（Watt Toolkit）、Clash/V2Ray 等代理工具，且用 Git 访问 GitHub 的机器。
> 本文是 2026-11-21 排查 CarolimoneHome 推送失败后沉淀的通用流程，可按需裁剪。

## 1. 先理解现象从哪来

Steam++ 的「网络加速」不是 VPN，它做两件事：

1. **改 hosts**：把 `github.com`、`api.github.com`、`raw.githubusercontent.com`、Steam 商店/社区等域名指向 `127.0.0.1`，并在 hosts 里用注释标记包起来：
   ```
   # Steam++ Start
   127.0.0.1 github.com
   ...
   # Steam++ End
   ```
2. **本地反代**：在 `127.0.0.1`（或 `0.0.0.0`）上监听 **443**（HTTPS）和 **80**（HTTP），用自带根证书（证书 Subject 含 `SteamTools Certificate`）给目标站点重签证书，再转发到真实服务器。

另外，`7890` 通常不是 Steam++ 的端口，而是 Clash / V2Ray 之类另一个代理工具的 HTTP 代理端口。两个代理同时运行，就会出现「端口被占 / 请求走错代理 / 证书对不上」的各种组合问题。

由此得到几条关键判断：

| 现象 | 根因 |
| --- | --- |
| `github.com` 解析到 `127.0.0.1` | hosts 正被 Steam++ 改写 |
| 443 端口有监听，但 TLS 报 `unable to get local issuer certificate` | 连接到了 Steam++ 反代，客户端不信任 `SteamTools Certificate` |
| hosts 仍指向 `127.0.0.1`，但 443 没有监听 | Steam++ 已退出/崩溃，hosts 残留 → 连接被拒或超时 |
| 443 被非 Steam++ 进程占用 | 端口冲突，Steam++ 加速实际失效 |
| `SEC_E_NO_CREDENTIALS`（schannel） | Windows TLS 后端（schannel）在受限环境不可用，和端口无关 |
| 只有大文件 push 报 `Connection reset` | 代理缓冲/超时，或代理进程在传输中退出 |

## 2. 步骤一：一键摸清现状

直接运行仓库脚本：

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\steampp-port-check.ps1
```

它会输出四块信息，并给出结论建议：

1. hosts 里 `# Steam++ Start` ~ `# Steam++ End` 段的域名列表；
2. `github.com` 当前解析结果（是否 `127.0.0.1`）；
3. 80 / 443 / 7890 / 1080 / 8080 的监听地址 + 占用进程（PID、进程名、路径）；
4. 各本地代理端口的连通性，以及推荐动作。

手动排查时对应的原生命令：

```powershell
# 1) hosts 是否被改
Get-Content C:\Windows\System32\drivers\etc\hosts

# 2) 域名解析
Resolve-DnsName github.com -Type A

# 3) 端口占用
Get-NetTCPConnection -State Listen |
  Where-Object LocalPort -in 80,443,7890,1080 |
  Select-Object LocalAddress,LocalPort,OwningProcess

# 4) 占用者是谁
Get-NetTCPConnection -State Listen -LocalPort 443 |
  ForEach-Object { Get-Process -Id $_.OwningProcess | Select-Object Id,ProcessName,Path }

# 5) 刷新 DNS（改完 hosts 后）
ipconfig /flushdns
```

判定表：

| hosts 指向 127.0.0.1 | 443 是否有监听 | 结论与去向 |
| --- | --- | --- |
| 是 | 是（Steam++/Watt 进程） | 走方案 B（信任 SteamTools CA）或方案 A（关闭加速） |
| 是 | 否 | 走方案 A 或方案 C（代理残留导致断网） |
| 否 | 是（其他进程） | 走方案 D（端口冲突） |
| 否 | 否 | 与 Steam++ 无关，按普通网络问题排查 |

## 3. 方案 A：彻底关闭加速，恢复直连（最稳）

适用：不依赖 Steam++ 加速、或加速进程已异常退出。

1. 托盘右键 Steam++ → 退出；只想保留 Steam 加速时，在设置里单独关闭「GitHub 加速 / 网络加速」。
2. 检查 hosts：正常情况下退出后 Steam++ 段落会被清空；若仍有 `# Steam++ Start ... # Steam++ End`，用**管理员权限**删除整段（不要手改其他行）。
3. 确认没有残留监听：脚本里 443/80 不再有 Steam++ 进程。
4. 验证：
   ```powershell
   ipconfig /flushdns
   Resolve-DnsName github.com -Type A      # 应返回 GitHub 真实 IP
   git ls-remote https://github.com/<用户>/<仓库>.git
   ```
5. 直连 GitHub 慢的话，改用方案 C 的代理。

注意：**不要**在 Steam++ 运行期间手改 hosts，它会在启动/退出时重写。

## 4. 方案 B：保留 Steam++，让 Git 信任它的根证书

适用：必须用 Steam++ 加速，但 `git` 报 `unable to get local issuer certificate`。

原理：从 Windows 根证书存储导出 `SteamTools Certificate`，与 Git 自带的 CA 包合并成一个临时 CA bundle，再让 Git 用它校验。

```powershell
# 生成临时 CA 包（放到 TEMP，不落仓库）
$bundle = Join-Path $env:TEMP 'ca-bundle-steamtools.crt'
$gitCa  = Get-Content 'C:\Program Files\Git\mingw64\etc\ssl\certs\ca-bundle.crt' -Raw
$sb = New-Object System.Text.StringBuilder
[void]$sb.Append($gitCa.TrimEnd()); [void]$sb.Append("`n")
$certs = Get-ChildItem Cert:\LocalMachine\Root, Cert:\CurrentUser\Root |
         Where-Object { $_.Subject -match 'SteamTools|Steamcommunity302' } |
         Sort-Object Thumbprint -Unique
foreach ($c in $certs) {
    $b64 = [Convert]::ToBase64String($c.RawData)
    [void]$sb.Append("-----BEGIN CERTIFICATE-----`n")
    for ($i = 0; $i -lt $b64.Length; $i += 64) {
        [void]$sb.Append($b64.Substring($i, [Math]::Min(64, $b64.Length - $i)) + "`n")
    }
    [void]$sb.Append("-----END CERTIFICATE-----`n")
}
Set-Content -Path $bundle -Value $sb.ToString() -Encoding ascii
```

之后所有 git 命令带上 TLS 参数（Windows 上 Git 默认 schannel，wincred/schannel 异常时用 openssl 后端更稳）：

```powershell
git -c http.sslBackend=openssl -c "http.sslCAInfo=$bundle" push origin master
```

要点：

- 这仍然是**有校验**的连接，只是额外信任了本机 Steam++ 的 CA；
- `ca-bundle.crt` 路径随 Git 安装位置变化，可用 `git --exec-path` 推断，或直接 `Get-ChildItem 'C:\Program Files\Git' -Recurse -Filter ca-bundle.crt` 查找；
- 临时 CA 包放 `%TEMP%`，不要提交到仓库。

## 5. 方案 C：改用另一个可用代理（例：7890）

适用：Steam++ 的 443 反代已退出/不稳定，但机器上有 Clash 等代理在 `127.0.0.1:7890` 正常监听。

```powershell
git -c http.sslBackend=openssl -c "http.sslCAInfo=$bundle" `
    -c http.proxy=http://127.0.0.1:7890 push origin master
```

为什么能生效：走 HTTP 代理时由代理端解析域名，**不经过本机 hosts**，所以即使 `github.com` 仍指向 `127.0.0.1` 也能连到真实 GitHub；真实站点的证书用 Git 自带 CA 即可校验（此时 `sslCAInfo` 可省略，保留也无副作用）。

冲突处理：

- 同一时间只保留一个「系统代理/端口转发」工具；
- 7890 被占用时，改 Clash 的混合端口，或退出两个工具之一再按需启动；
- 若代理只支持 SOCKS，用 `socks5h://127.0.0.1:<端口>`（`h` 表示由代理解析域名）。

## 6. 方案 D：端口被占用，Steam++ 起不来

1. 找占用者：
   ```powershell
   Get-NetTCPConnection -State Listen -LocalPort 443 |
     ForEach-Object { Get-Process -Id $_.OwningProcess | Select-Object Id,ProcessName,Path }
   ```
2. 若是残留的 Steam++/Clash 进程：结束进程后重启对应工具，并检查「开机自启」是否重复拉起。
   ```powershell
   Get-CimInstance Win32_StartupCommand | Select-Object Name,Command,Location
   ```
3. 若是 Windows 服务（IIS、远程管理等）：`Get-Service` 找到服务名后停用或改端口。
4. 不要用改 hosts 的方式"绕过"端口占用——那只会让域名彻底不可达。

## 7. 方案 E：凭据助手在受限环境失败

症状：`couldn't create signal pipe` / `unable to get password from user`，即使 Windows 凭据管理器里存着 GitHub 凭据。

原因：Git 的 credential helper 通过 shell 启动，受限环境（如某些沙箱）无法创建管道。

可复用做法：

```powershell
# 1) 直接向 GCM 要凭据（stdout 形如 username=... / password=...）
$raw = "protocol=https`nhost=github.com`n`n" |
       & 'C:\Program Files\Git\mingw64\bin\git-credential-manager.exe' get 2>&1

# 2) 用环境变量注入 Authorization 头，避免令牌出现在命令行/历史里
$b64 = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$user`:$pass"))
$env:GIT_CONFIG_COUNT   = '1'
$env:GIT_CONFIG_KEY_0   = 'http.extraHeader'
$env:GIT_CONFIG_VALUE_0 = "Authorization: Basic $b64"

git -c http.sslBackend=openssl -c "http.sslCAInfo=$bundle" -c credential.helper= push origin master
```

用完清理 `GIT_CONFIG_*` 环境变量，确保令牌不落盘、不回显。

## 8. 验证清单（改完必须过一遍）

- [ ] `Resolve-DnsName github.com` 结果符合预期（直连=真实 IP；加速=127.0.0.1）
- [ ] 443/80 的监听者符合预期，且是唯一一个代理在监听
- [ ] `git -c ... ls-remote <仓库>` 能成功（优先保持证书校验）
- [ ] `git push` 成功，远端能看到新 commit
- [ ] 浏览器访问 GitHub 正常，无证书告警

## 9. 常见报错速查

| 报错 | 含义 | 处理 |
| --- | --- | --- |
| `SEC_E_NO_CREDENTIALS`（schannel） | Windows TLS 后端取不到凭据 | Git 加 `-c http.sslBackend=openssl` |
| `unable to get local issuer certificate` | 不信任 SteamTools CA | 方案 B |
| `Failed to connect ... port 443` / `Connection reset` | hosts 指向 127.0.0.1 但代理未运行，或代理崩溃 | 方案 A / C，重启 Steam++ |
| 大文件 push 中途 `Connection reset` | 代理缓冲/超时 | 重试、改用 7890、必要时 `-c http.version=HTTP/1.1` |
| `couldn't create signal pipe` | credential helper 经 shell 启动失败 | 方案 E |
| 端口 443 被占用但 Steam++ 未运行 | 其他服务/残留进程 | 方案 D |

## 10. 维护说明（本仓库）

- 一键诊断脚本：`tools/steampp-port-check.ps1`，可选参数 `-Ports`、`-HostsPath`、`-Targets`、`-Json`。
- 脚本兼容 Windows PowerShell 5.1（不需要 PowerShell 7）；因含中文，`.ps1` 必须保存为 **UTF-8 with BOM**，否则 5.1 会按 ANSI 解析并报语法/引号错误。
- 该排查只影响**推送与访问**，不影响 Cloudflare 部署；`.assetsignore` 已把 `.git`、`tools/`、`docs/steampp-*.md` 等排除在静态资源之外。
- 任何代理地址里的访问令牌都不写入仓库、日志或提交信息。
