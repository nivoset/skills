$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$skillsRoot = Join-Path $repoRoot 'skills'

if (-not (Test-Path -LiteralPath $skillsRoot -PathType Container)) {
  throw "Missing skills directory: $skillsRoot"
}

$skillDirs = Get-ChildItem -LiteralPath $skillsRoot -Directory

if ($skillDirs.Count -eq 0) {
  Write-Host 'No skills found under skills/. Structure is valid but empty.'
  exit 0
}

$errors = New-Object System.Collections.Generic.List[string]

foreach ($dir in $skillDirs) {
  $skillFile = Join-Path $dir.FullName 'SKILL.md'

  if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
    $errors.Add("[$($dir.Name)] Missing SKILL.md")
    continue
  }

  $raw = Get-Content -LiteralPath $skillFile -Raw

  if ($raw -notmatch "(?s)^---\r?\n(.*?)\r?\n---") {
    $errors.Add("[$($dir.Name)] Missing YAML frontmatter")
    continue
  }

  $frontmatter = $Matches[1]

  $nameMatch = [regex]::Match($frontmatter, '(?m)^name:\s*(.+?)\s*$')
  $descriptionMatch = [regex]::Match($frontmatter, '(?m)^description:\s*(.+?)\s*$')

  if (-not $nameMatch.Success) {
    $errors.Add("[$($dir.Name)] Frontmatter is missing 'name'")
  } else {
    $name = $nameMatch.Groups[1].Value.Trim().Trim('"').Trim("'")
    if ($name -ne $dir.Name) {
      $errors.Add("[$($dir.Name)] Frontmatter name '$name' does not match directory name")
    }
  }

  if (-not $descriptionMatch.Success) {
    $errors.Add("[$($dir.Name)] Frontmatter is missing 'description'")
  }
}

if ($errors.Count -gt 0) {
  $errors | ForEach-Object { Write-Error $_ }
  throw "Skill validation failed with $($errors.Count) error(s)."
}

Write-Host "Validated $($skillDirs.Count) skill director$(if ($skillDirs.Count -eq 1) { 'y' } else { 'ies' })."
