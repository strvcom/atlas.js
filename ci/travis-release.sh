#!/usr/bin/env bash

# Set up git user
git config user.name "Travis-CI"
git config user.email "travis@travis-ci.org"

# Set up remote
git remote add pushback "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git"
git checkout "${TRAVIS_BRANCH}"

npx lerna outdated
npx lerna publish \
  --sort \
  --conventional-commits \
  --yes \
  --git-remote pushback \
  --message "chore: release [ci skip]"
