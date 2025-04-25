#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo -e "${BLUE}Building...${RESET}"

web-ext build -s "./src" -a "dist" --overwrite-dest -n "reddit-auto-theme.zip"

echo -e "${GREEN}All done.${RESET}"
