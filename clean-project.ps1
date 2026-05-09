# Czyszczenie projektu React Native + .NET przed pakowaniem
Write-Host "🧹 Czyszczenie projektu..." -ForegroundColor Cyan

# Pobranie bezwzględnej ścieżki do folderu, w którym znajduje się TEN skrypt
$basePath = $PSScriptRoot
if ([string]::IsNullOrEmpty($basePath)) { $basePath = (Get-Location).Path }

Write-Host "Lokalizacja projektu: $basePath" -ForegroundColor DarkGray

# Definicja pełnych ścieżek
$rnPath = Join-Path $basePath "rn\HotelMobile"
$dotnetPath = Join-Path $basePath "dotnet\HotelManageSys.API"

# Funkcja pomocnicza do usuwania z informacją zwrotną
function Remove-Target {
    param([string]$Path, [string]$Name)
    if (Test-Path $Path) {
        Write-Host "Usuwanie $Name..." -ForegroundColor Yellow
        Remove-Item -Path $Path -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 1. React Native - node_modules
$nodeModulesPath = Join-Path $rnPath "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "Usuwanie node_modules (to może chwilę potrwać)..." -ForegroundColor Yellow
    # CMD radzi sobie lepiej z głębokimi ścieżkami na Windowsie niż starszy PowerShell
    cmd.exe /c "rd /s /q `"$nodeModulesPath`"" 2>$null
}

# 2. React Native - Cache i buildy
Remove-Target -Path (Join-Path $rnPath "android\.gradle") -Name "Android .gradle cache"
Remove-Target -Path (Join-Path $rnPath "android\build") -Name "Android build"
Remove-Target -Path (Join-Path $rnPath "android\app\build") -Name "Android app build"
Remove-Target -Path (Join-Path $rnPath "android\app\.cxx") -Name "Android .cxx"
Remove-Target -Path (Join-Path $rnPath "ios\Pods") -Name "iOS Pods"
Remove-Target -Path (Join-Path $rnPath "ios\build") -Name "iOS build"
Remove-Target -Path (Join-Path $rnPath ".metro") -Name "Metro cache"

# 3. .NET
Remove-Target -Path (Join-Path $dotnetPath "bin") -Name ".NET bin"
Remove-Target -Path (Join-Path $dotnetPath "obj") -Name ".NET obj"

# Oblicz rozmiar po czyszczeniu
Write-Host "Podliczanie rozmiaru plików..." -ForegroundColor DarkGray
$size = 0
if (Test-Path $basePath) {
    $size = (Get-ChildItem -Path $basePath -Recurse -File -ErrorAction SilentlyContinue | 
             Measure-Object -Property Length -Sum).Sum / 1MB
}

Write-Host ""
Write-Host "✅ Gotowe! Rozmiar projektu: $([math]::Round($size, 2)) MB" -ForegroundColor Green