#!/usr/bin/env bash

# Set up git user based on last commit's author
git config user.name "$(git show --quiet --format=%an "${TRAVIS_COMMIT}")"
git config user.email "$(git show --quiet --format=%ae "${TRAVIS_COMMIT}")"

# Authorise npm for publishing
cat <<NPMRC >> ~/.npmrc
@atlas.js:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
NPMRC

# Set up git remote
git remote add pushable-origin "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"
git checkout "${TRAVIS_BRANCH}"

# Prepare arguments for deployment with lerna
lernaargs=(
  --yes
  --sort
  --conventional-commits
  --git-remote pushable-origin
  --message "chore: release [ci skip]"
)

# Customise the release depending on the branch we are releasing from
case "${TRAVIS_BRANCH}" in
  "release/latest")   lernaargs+=(--npm-tag=latest) ;;
  "release/next")     lernaargs+=(--npm-tag=next --canary) ;;
esac

# Publish!
npx lerna publish "${lernaargs[@]}"
