# Delete matching files in _posts/
Get-ChildItem -Path .\_posts\blog-template-*.md | Where-Object {
    $_.Name -match '^blog-template-\d+\.md$'
} | Remove-Item -Force

Write-Host "Deleted matching blog-template-N.md files."

# Remove cleanup.sh if it exists
if (Test-Path .\cleanup.sh) {
    Remove-Item .\cleanup.sh -Force
}

# Remove this script
$MyInvocation.MyCommand.Path | Remove-Item -Force

Write-Host "Removed cleanup scripts."
