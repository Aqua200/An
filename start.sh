#!/bin/bash

# Define color for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to print messages in green
print_green() {
    echo -e "${GREEN}$1${NC}"
}

# Infinite loop to install npm dependencies and start the app
while true; do
    echo ""
    print_green "Installing npm dependencies..."
    if npm install; then
        print_green "Starting the application..."
        if npm start; then
            print_green "Application started successfully!"
        else
            echo "Failed to start the application."
        fi
    else
        echo "Failed to install npm dependencies."
    fi
    # Sleep for 1 second before restarting the loop
    sleep 1
done
