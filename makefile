# Defining shell is necessary in order to modify PATH
SHELL := bash
export PATH := node_modules/.bin/:$(PATH)
export NODE_OPTIONS := --trace-deprecation --trace-warnings

# Modify these variables in local.mk to add flags to the commands, ie.
# testflags += --reporter nyan
# Now mocha will be invoked with the extra flag and will show a nice nyan cat as progress bar 🎉
testflags :=
compileflags :=
lintflags :=
installflags :=

# Do this when make is invoked without targets
all: compile

compile: install
	babel . -q --extensions .es --source-maps both --out-dir . --ignore node_modules $(compileflags)

# Note about `touch`:
# npm does not update the timestamp of the node_modules folder itself. This confuses Make as it
# thinks node_modules is not up to date and tries to constantly install pacakges. Touching
# node_modules after installation fixes that.
node_modules: package.json
	npm install $(installflags) && \
	lerna bootstrap --loglevel success && \
	touch node_modules

install: node_modules

lint:
	eslint --ext .es $(lintflags) .

test: compile
	mocha $(testflags)

test-debug: compile
	mocha --inspect --inspect-brk $(testflags)

coverage: compile
	nyc mocha $(testflags)

docs: compile
	esdoc

publish: compile lint test
	lerna publish --conventional-commits

clean:
	rm -rf {.nyc_output,coverage,docs}

outdated:
	npm outdated || true
	lerna exec "npm outdated || true"

unlock:
	rm -rf node_modules packages/*/node_modules
	find . -name package-lock.json -print -delete
	touch package.json

# Delete all the .js and .js.map files (excluding any potential dotfiles with .js extension)
distclean: clean
	find packages test \
		\( \
			-name '*.js' -or -name '*.js.map' \
		\) \
		-not -path "*/node_modules/*" -not -name '.*.js' \
		-print -delete

pristine: distclean
	rm -rf node_modules packages/*/node_modules

.PHONY: install lint test test-debug docs clean distclean pristine

-include local.mk
