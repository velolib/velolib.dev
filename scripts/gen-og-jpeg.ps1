Get-ChildItem -Path .\public\images\reviews -Filter "backdrop.webp" -Recurse | ForEach-Object { 
  $targetFile = "$($_.DirectoryName)\og.jpeg"
  if (-not (Test-Path $targetFile)) { 
    magick $_.FullName -resize '1200x>' -quality 80 "$targetFile" 
  } 
}