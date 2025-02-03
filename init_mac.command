#!/bin/bash

# Navigate to the folder containing the script
cd "$(dirname "$0")/__init"

# Make sure the script is executable
chmod +x unix.sh

# Run the shell script
./unix.sh

# Pause (optional, to keep the terminal open after execution)
echo "Script finished. Press any key to exit..."
read -n 1 -s
