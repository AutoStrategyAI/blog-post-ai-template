# PowerShell script for installing Ruby, Jekyll, and Bundler on Windows 10

# Exit on error
$ErrorActionPreference = "Stop"

# Install Chocolatey if not already installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Output "Installing Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    RefreshEnv
}

# Install Ruby using Chocolatey
Write-Output "Installing Ruby..."
choco install ruby -y

# Refresh environment variables
$env:Path += ";$($env:ChocolateyInstall)\bin"
[System.Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::Machine)

# Verify Ruby installation
ruby -v

# Install RubyGems 3.4
Write-Output "Updating RubyGems to version 3.4..."
gem update --system 3.4

# Install Jekyll and Bundler
Write-Output "Installing Jekyll and Bundler..."
gem install jekyll bundler

# Verify Jekyll installation
Write-Output "Checking Jekyll installation..."
if (jekyll -v) {
    Write-Output "Jekyll is installed and working correctly!"
} else {
    Write-Output "Jekyll installation failed."
}

Write-Output "Creating a test Jekyll project..."
New-Item -ItemType Directory -Path "$HOME\jekyll-test" -Force
Set-Location "$HOME\jekyll-test"

bundle init
Add-Content -Path "Gemfile" -Value "gem 'jekyll'"
bundle install

Write-Output "Jekyll installation completed! You can now use it with 'bundle exec jekyll serve' in your project folder."
