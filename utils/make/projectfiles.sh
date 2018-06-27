#!/bin/sh

EXT=$1

find . \
  -name "*.${EXT}" \
  -not -path '*/node_modules/*' \
  -not -path '*/.*' \
  -not -name '.*.js' \
  -not -name babel.config.js
