#!/bin/sh
# Cross-shell compatible (bash, zsh, fish when invoked via sh/bash)

# Remove matching files in _posts/
find ./_posts -type f -regex '.*/blog-template-[0-9]\+.md' -delete

echo "Deleted matching blog-template-N.md files."

# Remove cleanup.ps1 and this script
rm -f "./cleanup.ps1" "$0"

echo "Removed cleanup scripts."
