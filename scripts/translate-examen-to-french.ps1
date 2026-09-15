$ErrorActionPreference = 'Stop'
$dataPath = Join-Path (Split-Path -Parent $PSScriptRoot) 'data\marks-examen-index.json'
$data = Get-Content $dataPath -Raw | ConvertFrom-Json
$cache = @{}

function Translate-Text([string] $text) {
    if ([string]::IsNullOrWhiteSpace($text)) { return '' }
    if ($cache.ContainsKey($text)) { return $cache[$text] }
    $uri = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=fr&dt=t&q=' + [uri]::EscapeDataString($text)
    try {
        $response = Invoke-RestMethod -Uri $uri -UseBasicParsing
    } catch {
        throw "Translation service unavailable or rate-limited. Existing JSON was not written. Details: $($_.Exception.Message)"
    }
    $translated = (($response[0] | ForEach-Object { $_[0] }) -join '')
    if ([string]::IsNullOrWhiteSpace($translated)) { throw "Empty translation for: $text" }
    $cache[$text] = $translated
    return $translated
}

foreach ($step in $data.steps) {
    $step | Add-Member -NotePropertyName frTitle -NotePropertyValue (Translate-Text $step.title) -Force
}
foreach ($mark in $data.marks) {
    $mark | Add-Member -NotePropertyName frTitle -NotePropertyValue (Translate-Text $mark.title) -Force
    foreach ($week in $mark.weeks) {
        $week | Add-Member -NotePropertyName frTheme -NotePropertyValue (Translate-Text $week.theme) -Force
        $week | Add-Member -NotePropertyName frScripture -NotePropertyValue (Translate-Text $week.scripture) -Force
        foreach ($day in $week.days) {
            $day | Add-Member -NotePropertyName frPrompt -NotePropertyValue (Translate-Text $day.prompt) -Force
            $day | Add-Member -NotePropertyName frDay -NotePropertyValue (Translate-Text $day.day) -Force
        }
    }
}
foreach ($record in $data.records) {
    $record | Add-Member -NotePropertyName frMark -NotePropertyValue (Translate-Text $record.mark) -Force
    $record | Add-Member -NotePropertyName frTheme -NotePropertyValue (Translate-Text $record.theme) -Force
    $record | Add-Member -NotePropertyName frScripture -NotePropertyValue (Translate-Text $record.scripture) -Force
    $record | Add-Member -NotePropertyName frPrompt -NotePropertyValue (Translate-Text $record.prompt) -Force
    $record | Add-Member -NotePropertyName frDay -NotePropertyValue (Translate-Text $record.day) -Force
}
foreach ($record in $data.sourceRecords) {
    $record | Add-Member -NotePropertyName frMark -NotePropertyValue (Translate-Text $record.mark) -Force
    $record | Add-Member -NotePropertyName frTheme -NotePropertyValue (Translate-Text $record.theme) -Force
    $record | Add-Member -NotePropertyName frPrompt -NotePropertyValue (Translate-Text $record.prompt) -Force
}
$data | ConvertTo-Json -Depth 20 | Set-Content $dataPath -Encoding UTF8
Write-Output "Translated $($data.records.Count) daily prompts and all structured Examen labels into the offline bundle."