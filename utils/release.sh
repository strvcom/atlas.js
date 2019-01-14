#!/usr/bin/env bash

# Authorise npm for publishing
cat <<NPMRC >> ~/.npmrc
@atlas.js:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
NPMRC

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
