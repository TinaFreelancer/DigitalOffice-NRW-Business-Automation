# Requires: ImageMagick (magick) or ffmpeg installed and on PATH
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts/convert-images.ps1
# Converts PNG/JPG in assets/images to WebP and writes alongside originals.

$ErrorActionPreference = 'Stop'

function Test-Command {
  param([string]$Name)
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  return $null -ne $cmd
}

$imagesDir = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'assets' | Join-Path -ChildPath 'images'
if (-not (Test-Path $imagesDir)) { throw "Images directory not found: $imagesDir" }

$useMagick = Test-Command -Name 'magick'
$useFfmpeg = Test-Command -Name 'ffmpeg'
if (-not ($useMagick -or $useFfmpeg)) {
  Write-Host 'Bitte installiere ImageMagick oder ffmpeg und füge es zum PATH hinzu.' -ForegroundColor Yellow
  exit 1
}

# Target quality levels
$qualityHigh = 80   # for likely hero/above-the-fold
$qualityNormal = 70 # for general content

# Select files by size
$files = Get-ChildItem -Path $imagesDir -File -Include *.png,*.jpg,*.jpeg | Sort-Object Length -Descending

foreach ($f in $files) {
  $target = [System.IO.Path]::ChangeExtension($f.FullName, '.webp')
  if (Test-Path $target) {
    Write-Host "Skip (exists): $target" -ForegroundColor DarkGray
    continue
  }

  $sizeMB = [math]::Round($f.Length / 1MB, 2)
  $quality = if ($sizeMB -ge 1) { $qualityHigh } else { $qualityNormal }

  Write-Host "Converting ->" $f.Name "(" $sizeMB "MB ) to" ([System.IO.Path]::GetFileName($target)) "with q=$quality"

  if ($useMagick) {
    # Use ImageMagick for WebP conversion
    # -strip removes metadata; -quality sets compression; -define webp:method=6 for better compression
    magick "$($f.FullName)" -strip -quality $quality -define webp:method=6 "$target"
  } elseif ($useFfmpeg) {
    # Use ffmpeg as fallback
    ffmpeg -y -i "$($f.FullName)" -c:v libwebp -qscale:v $quality "$target"
  }
}

Write-Host "Fertig. Bitte aktualisiere HTML-Referenzen auf .webp, wo möglich." -ForegroundColor Green
