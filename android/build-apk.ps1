<# LiGN Android build — run from the repo root on Windows.
   Prerequisites live in %LOCALAPPDATA%\LiGN-android (JDK 17 + SDK, no admin).
   First run signs with android\lign-release.keystore (generated once, NEVER
   committed, back it up in two places — losing it means updates are impossible).
#>
$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$tools = Join-Path $env:LOCALAPPDATA "LiGN-android"
$npmdir = "$env:LOCALAPPDATA\node-portable\node-v20.20.2-win-x64"
$env:PATH = "$npmdir;$env:PATH"
$env:JAVA_HOME = (Get-ChildItem "$tools\jdk-17*" -Directory | Select-Object -First 1).FullName
$env:ANDROID_HOME = "$tools\sdk"
$env:ANDROID_SDK_ROOT = "$tools\sdk"
$bw = "$tools\bubblewrap-tools\node_modules\.bin\bubblewrap.cmd"
Set-Location (Join-Path $repo "android")
& $bw build --skipPwaValidation
Write-Host "APK should be at: $(Join-Path $repo 'android\app-release-signed.apk')"
