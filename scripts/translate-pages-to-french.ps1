$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$pagesRoot = Join-Path $root 'pages'
$cachePath = Join-Path $root 'data\page-french-translation-cache.json'
$cache = @{}
if (Test-Path $cachePath) {
    $cached = Get-Content $cachePath -Raw | ConvertFrom-Json
    $cached.psobject.Properties | ForEach-Object { $cache[$_.Name] = $_.Value }
}
function Save-Cache { $cache | ConvertTo-Json -Depth 4 | Set-Content $cachePath -Encoding UTF8 }
function Translate-Text([string] $text) {
    $decoded = [System.Net.WebUtility]::HtmlDecode($text)
    if ([string]::IsNullOrWhiteSpace($decoded) -or $decoded.Trim().Length -lt 2) { return $text }
    $key = $decoded.Trim()
    if ($cache.ContainsKey($key)) { return $text.Replace($key, $cache[$key]) }
    $uri = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=' + [uri]::EscapeDataString($key)
    try {
        $response = Invoke-RestMethod -Uri $uri -UseBasicParsing
        $translated = (($response[0] | ForEach-Object { $_[0] }) -join '')
        if ([string]::IsNullOrWhiteSpace($translated)) { return $text }
        $cache[$key] = $translated
        Save-Cache
        Start-Sleep -Milliseconds 250
        return $text.Replace($key, $translated)
    } catch { Write-Warning "Translation failed for: $key"; return $text }
}
$skipTags = @('script', 'style', 'noscript')
Get-ChildItem $pagesRoot -Filter '*.html' -File | Where-Object { $_.Name -notlike '*.fr.html' } | ForEach-Object {
    $sourcePath = $_.FullName
    $targetPath = Join-Path $pagesRoot ($_.BaseName + '.fr.html')
    $html = [IO.File]::ReadAllText($sourcePath)
    $parts = [regex]::Split($html, '(<[^>]+>)')
    $insideSkippedTag = $false
    $translatedParts = foreach ($part in $parts) {
        if ($part -match '^<\s*(script|style|noscript)\b') { $insideSkippedTag = $true; $part }
        elseif ($part -match '^<\s*/\s*(script|style|noscript)\s*>') { $insideSkippedTag = $false; $part }
        elseif ($insideSkippedTag -or $part -match '^<[^>]+>$') { $part }
        else { Translate-Text $part }
    }
    [IO.File]::WriteAllText($targetPath, ($translatedParts -join ''), [Text.Encoding]::UTF8)
    Write-Output "Created $([IO.Path]::GetFileName($targetPath))"
}
Save-Cache
Write-Output 'French page generation complete.'
