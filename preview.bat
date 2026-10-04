@echo off
chcp 65001 >nul
rem ============================================
rem  本地预览博客：双击本文件即可
rem  启动后浏览器打开 http://127.0.0.1:1313/
rem  关闭：关掉本黑色窗口，或按 Ctrl+C
rem ============================================
cd /d "%~dp0"

if not exist "tools\hugo.exe" (
    echo [提示] 未找到本地 Hugo，正在尝试安装...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-hugo.ps1"
    if errorlevel 1 (
        echo [错误] Hugo 安装失败，请按 README 说明手动安装。
        pause
        exit /b 1
    )
)

echo 正在启动本地预览，浏览器将自动打开...
start "" http://127.0.0.1:1313/

"%~dp0tools\hugo.exe" server --bind 127.0.0.1 --port 1313 --baseURL http://127.0.0.1:1313/ --disableFastRender --navigateToChanged --cacheDir "%~dp0.hugo_cache"

pause
