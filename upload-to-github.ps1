# dsh-afdian GitHub Upload Script
# Run this script to upload the plugin to GitHub

Write-Host "=== dsh-afdian GitHub Upload ===" -ForegroundColor Cyan

# Check gh CLI
Write-Host "Checking GitHub CLI..." -ForegroundColor Yellow
$ghPath = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghPath) {
    Write-Host "ERROR: GitHub CLI not found!" -ForegroundColor Red
    Write-Host "Please install from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check login
Write-Host ""
Write-Host "Checking GitHub login..." -ForegroundColor Yellow
gh auth status

# Get username
Write-Host ""
Write-Host "Enter your GitHub username:" -ForegroundColor Cyan
$username = Read-Host "GitHub Username"

if (-not $username) {
    Write-Host "ERROR: Username cannot be empty!" -ForegroundColor Red
    exit 1
}

$repoName = "dsh-afdian"
$repoUrl = "https://github.com/$username/$repoName"

Write-Host ""
Write-Host "Creating repository: $repoUrl" -ForegroundColor Cyan

# Create and push
gh repo create $repoName --description "爱发电 (Afdian) data plugin for DeepSeek Harness" --public --source="$pluginDir" --push

Write-Host ""
Write-Host "=== SUCCESS ===" -ForegroundColor Green
Write-Host "Repository: $repoUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Add GitHub topics in Settings -> Topics" -ForegroundColor Yellow
