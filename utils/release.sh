#!/usr/bin/env bash

# Set up git user based on last commit's author
git config user.name "$(git show --quiet --format=%an "${TRAVIS_COMMIT}")"
git config user.email "$(git show --quiet --format=%ae "${TRAVIS_COMMIT}")"

# Authorise npm for publishing
cat <<NPMRC >> .npmrc
@atlas.js:registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
access=public
NPMRC
echo packages/* | xargs -t -n 1 cp .npmrc

# Set up git remote
git remote add pushable-origin "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"
git checkout "${TRAVIS_BRANCH}"

# Publish!
npx lerna publish \
  --sort \
  --conventional-commits \
  --yes \
  --git-remote pushable-origin \
  --npm-tag "${NPM_DISTTAG}"
  --message "chore: release [ci skip]"
