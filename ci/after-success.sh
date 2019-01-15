#!/usr/bin/env bash

set -o errexit
set -o pipefail

make coverage
node_modules/.bin/coveralls < coverage/lcov.info
