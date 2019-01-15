#!/usr/bin/env bash

set -o errexit
set -o pipefail

make coverage MOCHA_FLAGS="--reporter dot"
node_modules/.bin/coveralls < coverage/lcov.info
