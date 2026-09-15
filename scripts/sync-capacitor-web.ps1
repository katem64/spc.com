$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$www = Join-Path $root 'www'

if (Test-Path $www) {
    Remove-Item $www -Recurse -Force
}
New-Item -ItemType Directory -Path $www | Out-Null

$excludedDirectories = @('.git', 'android', 'node_modules', 'scripts', 'www')
$excludedExtensions = @('.pdf', '.docx', '.psd')

Get-ChildItem $root -Force | Where-Object { $_.Name -notin $excludedDirectories } | ForEach-Object {
    if ($_.PSIsContainer) {
        Copy-Item $_.FullName (Join-Path $www $_.Name) -Recurse -Force
    } elseif ($excludedExtensions -notcontains $_.Extension.ToLowerInvariant()) {
        Copy-Item $_.FullName (Join-Path $www $_.Name) -Force
    }
}

Write-Output "Synchronized web app into $www"