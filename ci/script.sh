#!/usr/bin/env bash

set -o errexit
set -o pipefail

npx @commitlint/travis-cli
make lint
make test
