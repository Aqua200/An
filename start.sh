#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print messages in green
print_green() {
    echo -e "${GREEN}$1${NC}"
}

# Function to print messages in red
print_red() {
    echo -e "${RED}$1${NC}"
}

# Function to print messages in yellow
print_yellow() {
    echo -e "${YELLOW}$1${NC}"
}

# Function to print messages in blue
print_blue() {
    echo -e "${BLUE}$1${NC}"
}

# Function to print messages in cyan
print_cyan() {
    echo -e "${CYAN}$1${NC}"
}

# Function to simulate a progress bar
progress_bar() {
    local duration=${1}
    local bar_length=30
    local sleep_interval=$(echo "scale=2; $duration/$bar_length" | bc)
    for ((i=0; i<=bar_length; i++)); do
        printf "${BLUE}["
        for ((j=0; j<i; j++)); do printf "="; done
        for ((j=i; j<bar_length; j++)); do printf " "; done
        printf "] ${CYAN}%3d%%${NC}\r" $((i*100/bar_length))
        sleep $sleep_interval
    done
    printf "\n"
}

# Display a welcome message
print_cyan "==========================================="
print_cyan "  Welcome to the Bot Setup Script           "
print_cyan "==========================================="
echo ""

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_red "npm is not installed. Installing npm..."
        progress_bar 2  # Simulate a 2-second progress bar
        if pkg install nodejs -y; then
            print_green "npm installed successfully."
        else
            print_red "Failed to install npm. Exiting..."
            exit 1
        fi
    fi
}

# Maximum number of retries
MAX_RETRIES=3
RETRY_COUNT=0

# Main loop to start the bot
while [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; do
    echo ""
    print_yellow "Installing npm dependencies..."
    progress_bar 3  # Simulate a 3-second progress bar
    if npm install; then
        print_green "Dependencies installed successfully!"
        print_yellow "Starting the bot..."
        progress_bar 2  # Simulate a 2-second progress bar
        if npm start; then
            print_green "Bot started successfully!"
            break  # Exit the loop if the bot starts successfully
        else
            print_red "Failed to start the bot."
            RETRY_COUNT=$((RETRY_COUNT + 1))
            if [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; then
                print_yellow "Retrying... ($RETRY_COUNT/$MAX_RETRIES)"
            else
                print_red "Max retries reached. Exiting..."
                exit 1
            fi
        fi
    else
        print_red "Failed to install npm dependencies."
        exit 1  # Exit if npm install fails
    fi
    # Sleep for 1 second before retrying
    sleep 1
done

# Display an exit message
print_cyan "==========================================="
print_cyan "  Thank you for using the bot setup script! "
print_cyan "==========================================="
