param(
    [Parameter(Mandatory = $true)]
    [string]$Folder
)

if (!(Test-Path $Folder)) {
    Write-Host ""
    Write-Host "Folder not found: $Folder" -ForegroundColor Red
    exit
}

$folderName = Split-Path $Folder -Leaf
$output = "review-$folderName.txt"

"" | Set-Content $output -Encoding UTF8

Get-ChildItem $Folder -File |
Where-Object {
    $_.Extension -eq ".ts" -or $_.Extension -eq ".tsx"
} |
Sort-Object Name |
ForEach-Object {

    Add-Content $output "============================================================"
    Add-Content $output "File: $($_.Name)"
    Add-Content $output "============================================================"
    Add-Content $output ""

    Get-Content $_.FullName | Add-Content $output

    Add-Content $output ""
    Add-Content $output ""
}

Write-Host ""
Write-Host ""
Write-Host "Done"
Write-Host ("Output File: " + $output) -ForegroundColor Green