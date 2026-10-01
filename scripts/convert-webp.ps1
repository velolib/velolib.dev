Get-ChildItem -Path .\public\images -Recurse -File |
  Where-Object { $_.Extension -in '.png', '.jpg', '.jpeg' -and $_.Name -ne 'og.jpeg' } |
  ForEach-Object {
    $targetFile = [System.IO.Path]::ChangeExtension($_.FullName, ".webp")
    if (-not (Test-Path $targetFile)) {
      if ($_.Extension -eq '.png') {
        magick $_.FullName -define webp:lossless=true "$targetFile"
      } else {
        magick $_.FullName -quality 90 "$targetFile"
      }
      if ($LASTEXITCODE -eq 0 -and (Test-Path $targetFile)) {
        Remove-Item $_.FullName
      }
    }
  }