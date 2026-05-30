Get-ChildItem -Path .\public\images -Filter *.jpg -Recurse | ForEach-Object { 
  magick $_.FullName "$($_.DirectoryName)\$($_.BaseName).webp"
  if ($LASTEXITCODE -eq 0) { 
    Remove-Item $_.FullName 
  } else {
    Write-Warning "Failed to convert $($_.Name)"
  }
}