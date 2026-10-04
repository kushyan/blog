# 本地预览：启动 Hugo 内置服务器（改动即时刷新，含草稿）
# 用法： pwsh -File .\preview.ps1
#        pwsh -File .\preview.ps1 -Port 1314 -Drafts:$false

param(
    [int]$Port = 1313,
    [switch]$Drafts = $true
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$hugo = Join-Path $root 'tools\hugo.exe'

if (-not (Test-Path $hugo)) {
    Write-Host "未找到本地 Hugo（$hugo）。" -ForegroundColor Yellow
    Write-Host "请先运行： pwsh -File .\setup-hugo.ps1" -ForegroundColor Yellow
    Write-Host "或直接使用系统已安装的 hugo 命令。" -ForegroundColor Yellow
    $hugo = 'hugo'
}

$args = @('server', '--bind', '127.0.0.1', '--port', "$Port", '--baseURL', "http://127.0.0.1:$Port/", '--disableFastRender', '--navigateToChanged')
if ($Drafts) { $args += '--buildDrafts' }

Write-Host "预览地址： http://127.0.0.1:$Port/   （Ctrl+C 停止）" -ForegroundColor Green
& $hugo @args
