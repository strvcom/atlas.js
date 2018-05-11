# Defining shell is necessary in order to modify PATH
SHELL := sh
export PATH := node_modules/.bin/:$(PATH)
export NODE_OPTIONS := --trace-deprecation --trace-warnings

# Modify these variables in local.mk to add flags to the commands, ie.
# FTEST += --reporter nyan
# Now mocha will be invoked with the extra flag and will show a nice nyan cat as progress bar 🎉
FTEST :=
FCOMPILE :=
FLINT :=
FINSTALL :=

SRCFILES := $(shell find . -name '*.mjs' -not -path '*/node_modules/*' -not -path './.git/*')
OUTFILES := $(patsubst %.mjs, %.js, $(SRCFILES))

# Do this when make is invoked without targets
all: precompile


# GENERIC TARGETS

node_modules: package.json
	npm install $(FINSTALL) && lerna bootstrap && touch node_modules

# Default compilation target for all source files
%.js: %.mjs node_modules .babelrc.js
	babel $< --out-file $@ $(FCOMPILE)


# TASK DEFINITIONS

compile: $(OUTFILES)

precompile: install
	babel . --extensions .mjs --out-dir . $(FCOMPILE)

install: node_modules

lint: force install
	eslint --ext .mjs --report-unused-disable-directives $(FLINT) .
	remark --quiet .

test: force compile
	mocha $(FTEST)

test-debug: force compile
	mocha --inspect --inspect-brk $(FTEST)

test-watch: force compile
	mocha --reporter min $(FTEST) --watch

coverage: force compile
	nyc mocha $(FTEST)

docs: compile
	esdoc

publish: force compile lint test
	lerna publish --conventional-commits

clean:
	rm -rf {.nyc_output,coverage,docs}
	find . -name '*.log' -print -delete

outdated:
	npm outdated || true
	lerna exec "npm outdated || true"

unlock: pristine
	rm package-lock.json packages/*/package-lock.json
	touch package.json

# Delete all the .js and .js.map files (excluding any potential dotfiles with .js extension)
distclean: clean
	rm -rf $(OUTFILES)

pristine: distclean
	rm -rf node_modules packages/*/node_modules

.PHONY: force

-include local.mk
