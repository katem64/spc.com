$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$docx = Join-Path $root '#SPC MARKS Examen_21Edited.docx'
$dataPath = Join-Path $root 'data\marks-examen-index.json'
$tempDocx = Join-Path $env:TEMP 'spc-examen-source-copy.docx'

Copy-Item -LiteralPath $docx -Destination $tempDocx -Force
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead($tempDocx)
$entry = $zip.GetEntry('word/document.xml')
$reader = [IO.StreamReader]::new($entry.Open())
$xml = $reader.ReadToEnd()
$reader.Dispose()
$zip.Dispose()
$source = $xml -replace '</w:p>', "`n" -replace '<w:tab[^>]*/>', ' ' -replace '<[^>]+>', ''
$source = [System.Net.WebUtility]::HtmlDecode($source) -replace '[ \t]+', ' '
$source = $source -replace '\r?\n\s*', "`n"
$source = $source.Replace(([string][char]0x00E2 + [char]0x20AC + [char]0x2122), "'")
$source = $source.Replace(([string][char]0x00E2 + [char]0x20AC + [char]0x2013), '-')
$source = $source.Replace(([string][char]0x00E2 + [char]0x20AC + [char]0x0153), '"')
$data = Get-Content $dataPath -Raw | ConvertFrom-Json
$firstMarkIndex = $source.IndexOf('Christ at the Center of my Life', [StringComparison]::OrdinalIgnoreCase)
if ($firstMarkIndex -lt 0) { throw 'Could not locate the first Mark in the DOCX' }
$preliminaries = $source.Substring(0, $firstMarkIndex).Trim()
$preliminaries = [regex]::Replace($preliminaries, '\b\d{4}-\d\s*\r?\n?\s*\d-\d\b', '').Trim()
$data | Add-Member -NotePropertyName preliminaries -NotePropertyValue $preliminaries -Force

foreach ($mark in $data.marks) {
    $escapedTitle = [regex]::Escape($mark.title)
    $titleMatches = [regex]::Matches($source, '(?is)' + $escapedTitle)
    $candidates = foreach ($candidate in $titleMatches) {
        $candidateWeek = $source.IndexOf('Week 1:', $candidate.Index, [StringComparison]::OrdinalIgnoreCase)
        $candidateActs = $source.IndexOf('Capitular Acts', $candidate.Index, [StringComparison]::OrdinalIgnoreCase)
        $candidateGrace = $source.IndexOf('Grace to beg', $candidate.Index, [StringComparison]::OrdinalIgnoreCase)
        if ($candidateWeek -gt $candidate.Index -and $candidateActs -gt $candidate.Index -and $candidateActs -lt $candidateWeek -and $candidateGrace -gt $candidateActs -and $candidateGrace -lt $candidateWeek) {
            [pscustomobject]@{ match = $candidate; weekIndex = $candidateWeek; distance = $candidateWeek - $candidate.Index }
        }
    }
    $selected = $candidates | Sort-Object distance | Select-Object -First 1
    $heading = if ($selected) { $selected.match } else { $null }
    if ($null -eq $heading) {
        throw "Could not locate DOCX heading for $($mark.title)"
    }
    $weekIndex = $source.IndexOf('Week 1:', $heading.Index, [StringComparison]::OrdinalIgnoreCase)
    if ($weekIndex -lt 0) {
        throw "Could not locate Week 1 for $($mark.title)"
    }
    $block = $source.Substring($heading.Index, $weekIndex - $heading.Index)
    $graceIndex = $block.IndexOf('Grace to beg', [StringComparison]::OrdinalIgnoreCase)
    $actsIndex = $block.IndexOf('Capitular Acts', [StringComparison]::OrdinalIgnoreCase)
    if ($actsIndex -lt 0 -or $graceIndex -lt 0) {
        throw "Missing Capitular Acts or Grace to beg for $($mark.title)"
    }
    $description = $block.Substring(0, $actsIndex).Trim()
    $description = [regex]::Replace($description, '(?im)^.*?' + $escapedTitle + '\s*', '', 1).Trim()
    $capitularActs = $block.Substring($actsIndex, $graceIndex - $actsIndex).Trim()
    $grace = $block.Substring($graceIndex + 'Grace to beg'.Length).Trim()
    $description = [regex]::Replace($description, '\b\d{8,}\s+\d{1,3}\b', '').Trim()
    $capitularActs = [regex]::Replace($capitularActs, '\b\d{8,}\s+\d{1,3}\b', '').Trim()
    $grace = [regex]::Replace($grace, '\b\d{8,}\s+\d{1,3}\b', '').Trim()
    $mark | Add-Member -NotePropertyName description -NotePropertyValue $description -Force
    $mark | Add-Member -NotePropertyName capitularActs -NotePropertyValue $capitularActs -Force
    $mark | Add-Member -NotePropertyName graceToBeg -NotePropertyValue $grace -Force
}

$data | ConvertTo-Json -Depth 25 | Set-Content $dataPath -Encoding UTF8
Write-Output "Enriched $($data.marks.Count) Marks from the authoritative DOCX."
