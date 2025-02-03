#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Install Homebrew if not already installed
if ! command -v brew &>/dev/null; then
    echo "Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Ruby using Homebrew
echo "Installing Ruby..."
brew install ruby

# Ensure the installed Ruby is in the PATH
export PATH="$(brew --prefix ruby)/bin:$PATH"
echo 'export PATH="$(brew --prefix ruby)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Install RubyGems 3.4
if gem -v | grep -q "3.4"; then
    echo "RubyGems 3.4 is already installed."
else
    echo "Updating to RubyGems 3.4..."
    gem update --system 3.4
fi

echo "Installing Jekyll and Bundler..."
gem install jekyll bundler

# Check if Jekyll is installed and can run
echo "Checking Jekyll installation..."
bundle exec jekyll -v && echo "Jekyll is installed and working correctly!" || echo "Jekyll installation failed."

echo "Installing Gemfile"
bundle install

echo "Jekyll installation completed! You can now use it with 'bundle exec jekyll serve' in your project folder."
