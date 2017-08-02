# Defining shell is necessary in order to modify PATH
SHELL := bash
export PATH := node_modules/.bin/:$(PATH)

# Do this when make is invoked without targets
all: compile

compile: install
	babel . -q --extensions .es --source-maps both --out-dir . --ignore node_modules

# In layman's terms: node_modules directory depends on the state of package.json Make will compare
# their timestamps and only if package.json is newer, it will run this target.
# Note about `touch`:
# npm does not update the timestamp of the node_modules folder itself. This confuses Make as it
# thinks node_modules is not up to date and tries to constantly install pacakges. Touching
# node_modules after installation fixes that.
node_modules: package.json
	npm install && \
	lerna bootstrap --loglevel success && \
	touch node_modules

install: node_modules

lint:
	eslint --ext .es .

test: compile
	mocha

test-debug: compile
	mocha --inspect --inspect-brk

coverage: compile
	nyc mocha

clean:
	rm -rf {.nyc_output,coverage,docs}

# Delete all the .js and .js.map files (excluding any potential dotfiles with .js extension)
distclean: clean
	find packages test \
		\( \
			-name '*.js' \
			-or -name '*.js.map' \
		\) \
		-not -path "*/node_modules/*" \
		-not -name '.*.js' \
		-print -delete

pristine: distclean
	rm -rf node_modules packages/*/node_modules

.PHONY: install lint test test-debug clean distclean pristine
