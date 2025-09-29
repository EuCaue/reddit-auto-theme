#!/usr/bin/env bash

EXT_NAME="reddit-auto-theme"
OUTPUT_DIR="dist"
SRC_DIR="$PWD/src"
TMP_DIR="$(mktemp -d)"

cp -r "$SRC_DIR"/* "$TMP_DIR"

# force PROD = true on all files
find "$TMP_DIR" -type f -name "*.js" -exec sed -i 's/^const PROD = .*/const PROD = true;/' {} +

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RESET='\033[0m'

echo -e "${BLUE}Building extension...${RESET}"

if web-ext build -s "$TMP_DIR" -a "$OUTPUT_DIR" --overwrite-dest -n "$EXT_NAME.zip"; then
  echo -e "${GREEN}Build complete.${RESET}"
  echo -e "Output: $PWD/$OUTPUT_DIR/$EXT_NAME.zip"
else
  echo -e "${RED}Build failed.${RESET}"
  exit 1
fi

# clear tmp files
rm -rf "$TMP_DIR"
