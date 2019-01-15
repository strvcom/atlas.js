#!/usr/bin/env bash

set -o errexit
set -o pipefail

lernaargs=(
  --yes
)

# Customise the release depending on the branch we are releasing from
case "${TRAVIS_BRANCH}" in
  "release/latest")   lernaargs+=("--dist-tag=latest") ;;
  "release/next")     lernaargs+=("--dist-tag=next") ;;
esac

# Publish!
npx lerna publish from-git "${lernaargs[@]}"
