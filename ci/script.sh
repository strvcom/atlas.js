#!/usr/bin/env bash

set -o errexit
set -o pipefail

make lint
make test
