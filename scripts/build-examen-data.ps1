$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$sourcePdf = Join-Path $root '#SPC MARKS Examen_21Edited.pdf'
$coverPdf = Join-Path $root '_23SPC_20MARKS_20Examen_Cover.pdf'
$tempText = Join-Path $env:TEMP 'spc-marks-examen.txt'
$outputJson = Join-Path $root 'data\marks-examen-index.json'
$coverImage = Join-Path $root 'assets\images\marks-examen-cover.png'
$ghostscript = 'C:\Users\KJM\scoop\shims\gs.exe'

if (-not (Test-Path $ghostscript)) {
    throw "Ghostscript was not found at $ghostscript"
}

& $ghostscript -q -sDEVICE=txtwrite -o $tempText $sourcePdf
$source = [System.IO.File]::ReadAllText($tempText, [System.Text.Encoding]::UTF8)
$source = $source.Replace(([string][char]0x00E2 + [char]0x20AC + [char]0x2122), [string][char]0x2019)
$source = $source.Replace(([string][char]0x00E2 + [char]0x20AC + [char]0x2013), [string][char]0x2013)
$source = $source.Replace(([string][char]0x00E2 + [char]0x20AC + [char]0x0153), [string][char]0x201C)
$sourceLines = $source -split "`r?`n"

$markNames = @(
    'Christ at the Center of my Life',
    'Generous and Warmhearted Service',
    'Mortification and Asceticism',
    'Tranquil Daring',
    'Docility to the Spirit',
    'Self-Effacement',
    'Simplicity',
    'Hospitality',
    'Responsible Stewardship',
    'Zeal for Mission and Availability',
    'All to All',
    'Charity in Community'
)

$dayNames = @('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
$records = [System.Collections.Generic.List[object]]::new()
$marks = [System.Collections.Generic.List[object]]::new()

function Normalize-SourceText([string] $value) {
    return (($value -replace '\s+', ' ').Trim())
}

for ($markNumber = 0; $markNumber -lt $markNames.Count; $markNumber++) {
    $markName = $markNames[$markNumber]
    $markPattern = '(?im)^[ \t]*SPC\s+MARK:[ \t]*' + [regex]::Escape($markName) + '[ \t]*\r?$'
    $markMatches = [regex]::Matches($source, $markPattern)
    if ($markMatches.Count -lt 4) {
        $markPattern = '(?im)^[ \t]*SPC\s+Mark:[ \t]*' + [regex]::Escape($markName) + '[ \t]*\r?$'
        $markMatches = [regex]::Matches($source, $markPattern)
    }

    $weeks = [System.Collections.Generic.List[object]]::new()
    for ($weekNumber = 1; $weekNumber -le 4; $weekNumber++) {
        $weekMatch = $markMatches[$weekNumber - 1]
        $allHeadings = [regex]::Matches($source, '(?im)^[ \t]*SPC\s+MARK:')
        $nextHeading = $allHeadings | Where-Object { $_.Index -gt $weekMatch.Index } | Select-Object -First 1
        $nextMarkStart = if ($null -ne $nextHeading) { $nextHeading.Index } else { $source.Length }
        $blockEnd = $nextMarkStart
        if ($weekNumber -lt 4 -and $markMatches[$weekNumber].Index -gt $weekMatch.Index) {
            $blockEnd = $markMatches[$weekNumber].Index
        }
        $block = $source.Substring($weekMatch.Index, $blockEnd - $weekMatch.Index)
        $weekHeader = [regex]::Match($block, '(?im)^\s*Week\s+' + $weekNumber + ':\s*(.+?)\s*$')
        $theme = if ($weekHeader.Success) { Normalize-SourceText $weekHeader.Groups[1].Value } else { "Week $weekNumber" }
        $scripture = ''
        $scriptureMatch = [regex]::Match($block, '(?im)^\s*[“"].+?(?:[”"].*?)?\s*$')
        if ($scriptureMatch.Success) { $scripture = Normalize-SourceText $scriptureMatch.Value }

        $days = [System.Collections.Generic.List[object]]::new()
        for ($dayIndex = 0; $dayIndex -lt $dayNames.Count; $dayIndex++) {
            $day = $dayNames[$dayIndex]
            $followingDays = ($dayNames | Select-Object -Skip ($dayIndex + 1)) -join '|'
            $nextDayPattern = if ($followingDays) { '^[ \t]*(?:' + $followingDays + ')[ \t]+' } else { '^[ \t]*SPC\s+MARK' }
            $dayMatch = [regex]::Match($block, '(?ims)^[ \t]*' + $day + '[ \t]+(.*?)(?=' + $nextDayPattern + '|\z)')
            $sourceDayLabel = $day
            if (-not $dayMatch.Success -and $day -eq 'Friday') {
                $dayMatch = [regex]::Match($block, '(?ims)^[ \t]*vow[ \t]+(.*?)(?=^[ \t]*Saturday[ \t]+|\z)')
                $sourceDayLabel = 'vow'
            }
            if (-not $dayMatch.Success) { throw "Missing $day for $markName, week $weekNumber" }
            $prompt = Normalize-SourceText $dayMatch.Groups[1].Value
            $record = [ordered]@{
                id = "mark-$($markNumber + 1)-week-$weekNumber-$($day.ToLower())"
                mark = $markName
                markNumber = $markNumber + 1
                week = $weekNumber
                weekNumber = $weekNumber
                theme = $theme
                day = $day
                sourceDayLabel = $sourceDayLabel
                scripture = $scripture
                prompt = $prompt
                contentType = 'daily-prompt'
                language = 'en'
            }
            $records.Add([pscustomobject]$record)
            $days.Add([pscustomobject]@{ day = $day; prompt = $prompt })
        }
        $weeks.Add([pscustomobject]@{ weekNumber = $weekNumber; theme = $theme; scripture = $scripture; days = $days })
    }
    $marks.Add([pscustomobject]@{ markNumber = $markNumber + 1; title = $markName; weeks = $weeks })
}

$intro = "Consciousness Examen trains us to live in constant awareness of God's loving presence, helps us recognize the Holy Spirit's movement in our daily lives, and guides us to imitate Christ."
$steps = @(
    [pscustomobject]@{ letter = 'M'; title = "Mindful of God's Presence" },
    [pscustomobject]@{ letter = 'A'; title = 'Appreciate with Gratitude' },
    [pscustomobject]@{ letter = 'R'; title = 'Review and Recognize Movements' },
    [pscustomobject]@{ letter = 'K'; title = "Kindle a Heart Open to God's Mercy" },
    [pscustomobject]@{ letter = 'S'; title = 'Surrender and Serve' }
)
$output = [ordered]@{
    title = 'M.A.R.K.S. Examen'
    intro = $intro
    steps = $steps
    marks = $marks
    records = $records
    sourceRecords = @(
        [ordered]@{
            id = 'source-examen-guide'
            mark = 'M.A.R.K.S. Examen'
            markNumber = 0
            week = 0
            weekNumber = 0
            theme = 'Authoritative source guide'
            day = 'Source'
            scripture = ''
            prompt = $source
            contentType = 'source-content'
            language = 'en'
        }
    )
}
$output | ConvertTo-Json -Depth 12 | Set-Content -Path $outputJson -Encoding UTF8

& $ghostscript -q -dSAFER -dBATCH -dNOPAUSE -sDEVICE=pngalpha -r160 -dFirstPage=1 -dLastPage=1 -sOutputFile=$coverImage $coverPdf
Write-Output "Generated $($records.Count) daily records for $($marks.Count) Marks."