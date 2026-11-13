param (
    [string]$SourceDir = "c:\Learning\Work\HARP\files\harp-next",
    [string]$DestinationZip = "c:\Learning\Work\HARP\files\harp-next-phase3.zip"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression

if (Test-Path $DestinationZip) {
    Remove-Item $DestinationZip -Force
}

$zip = [System.IO.Compression.ZipFile]::Open($DestinationZip, [System.IO.Compression.ZipArchiveMode]::Create)

$files = Get-ChildItem -Path $SourceDir -Recurse | Where-Object {
    $_.FullName -notmatch '[\\/](node_modules|\.next|\.git)($|[\\/])' -and -not $_.PSIsContainer
}

foreach ($f in $files) {
    $relative = $f.FullName.Substring($SourceDir.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $relative, [System.IO.Compression.CompressionLevel]::Optimal)
}

$zip.Dispose()

$fileInfo = Get-Item $DestinationZip
Write-Host "Archive created at: $DestinationZip"
Write-Host "File size: $($fileInfo.Length) bytes ($([math]::Round($fileInfo.Length / 1MB, 2)) MB)"

# Also refresh harp-next.zip
$rootZip = "c:\Learning\Work\HARP\files\harp-next.zip"
Copy-Item $DestinationZip $rootZip -Force
Write-Host "Updated root archive at: $rootZip"
