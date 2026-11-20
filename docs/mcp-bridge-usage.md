# ShunCode Bridge MCP 使用约定

本仓库已通过 ShunCode Bridge MCP（server `shuncode-bridge`，协议 `2025-03-26`）验证连接；`list_directory` 只读调用成功。该端点连接当前 ShunCode 打开的 Windows 本地工作区。连接地址包含访问标识，不写入仓库；重连时应从用户提供的地址重新初始化会话。

## 可用工具（15 项）

- 发现与读取：`list_directory`（浅层目录）、`find_files`（文件名/路径）、`search_files`（文本）、`read_files`（UTF-8）、`read_image`（图片）。这些文件工具仅限当前工作区。
- 语义与检查：`lsp`（符号、定义、引用、类型等）、`get_diagnostics`（编辑器诊断）。LSP 无结果不等于不存在。
- 编辑：`apply_patch`（工作区内多文件补丁；若 `read_files` 返回版本哈希，编辑时传 `expected_versions`）。补丁上下文过期时先重读再重试。
- 命令：`run_command`（本机 PortableGit Bash，作用域可能超出工作区）；长命令用 `get_command_output`、`send_command_input`、`cancel_command` 管理。工作区外先确认准确路径、优先只读定位；涉及破坏性操作应获得对应用户授权。
- 任务协同：`set_todos`（多步骤任务的完整有序列表及生命周期）、`update_plan`（兼容形式）、`report_progress`（临时进度）。新多步骤任务先 `new_task=true`；后续沿用 `task_id` 和 `expected_revision`，结束答复前提交已确认的完成或阻塞状态。

## 建议流程

独立查询可并发；有依赖的读取、编辑、验证按序进行，不并发修改同一文件。先定位文件和语义位置，再读取相关范围，随后用小而集中的补丁修改；修改后查看诊断并运行相关构建或测试。长任务适度报告进度。分析、审查、计划类交付按 Bridge 约定存入仓库 `docs/mcp-<topic>.md`，探测脚本及日志不放入 `docs/`。当前只完成连接与只读探测，未执行构建或修改业务代码。
