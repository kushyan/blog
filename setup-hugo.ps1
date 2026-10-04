# 安装本地 Hugo Extended（仅本机预览用；GitHub Actions 上会自动安装）
# 用法： pwsh -File .\setup-hugo.ps1
#        pwsh -File .\setup-hugo.ps1 -Version 0.167.0

param(
    [string]$Version = '0.167.0'
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$tools = Join-Path $root 'tools'
New-Item -ItemType Directory -Force -Path $tools | Out-Null
$exe = Join-Path $tools 'hugo.exe'

if (Test-Path $exe) {
    Write-Host "已存在： $exe" -ForegroundColor Green
    & $exe version
    return
}

$file = "hugo_extended_${Version}_windows-amd64.zip"
$upstream = "https://github.com/gohugoio/hugo/releases/download/v$Version/$file"

# 依次尝试：直连 → 各镜像加速
$urls = @(
    $upstream,
    "https://gh-proxy.com/$upstream",
    "https://ghfast.top/$upstream",
    "https://ghproxy.net/$upstream"
)

$zip = Join-Path $env:TEMP $file
$ok = $false
foreach ($u in $urls) {
    Write-Host "尝试下载： $u" -ForegroundColor Cyan
    try {
        Invoke-WebRequest -Uri $u -OutFile $zip -UseBasicParsing -TimeoutSec 300
        $ok = $true
        break
    }
    catch {
        Write-Host "  失败： $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

if (-not $ok) {
    Write-Host "`n全部下载地址均失败。请手动下载后解压 hugo.exe 到 $tools" -ForegroundColor Red
    Write-Host $upstream -ForegroundColor Red
    exit 1
}

Expand-Archive -Path $zip -DestinationPath $tools -Force
Remove-Item $zip -Force -ErrorAction SilentlyContinue

Write-Host "`n安装完成：" -ForegroundColor Green
& $exe version

Write-Host "`n本地预览： pwsh -File .\preview.ps1" -ForegroundColor Green
