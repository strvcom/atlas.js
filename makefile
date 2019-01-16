# Defining shell is necessary in order to modify PATH
SHELL := sh
export PATH := node_modules/.bin/:$(PATH)
export NODE_OPTIONS := --trace-deprecation

# Modify these variables in local.mk to add flags to the commands, ie.
# MOCHA_FLAGS += --reporter nyan
# Now mocha will be invoked with the extra flag and will show a nice nyan cat as progress bar 🎉
MOCHA_FLAGS :=
BABEL_FLAGS :=
ESLINT_FLAGS :=
NPM_FLAGS :=
LERNA_FLAGS :=

SRCFILES := $(patsubst %.mjs, %.js, $(shell utils/make/projectfiles.sh mjs))
GITFILES := $(patsubst utils/githooks/%, .git/hooks/%, $(wildcard utils/githooks/*))

# Do this when make is invoked without targets
all: precompile githooks


# GENERIC TARGETS

node_modules: package.json
	npm ci $(NPM_FLAGS) && lerna bootstrap $(LERNA_FLAGS) && touch node_modules

# Default compilation target for all source files
%.js: %.mjs node_modules babel.config.js
	babel $< --out-file $@ $(BABEL_FLAGS)

# Default target for all possible git hooks
.git/hooks/%: utils/githooks/%
	cp $< $@

coverage/lcov.info: $(SRCFILES)
	nyc mocha $(MOCHA_FLAGS)


# TASK DEFINITIONS

githooks: $(GITFILES)

compile: $(SRCFILES)

coverage: coverage/lcov.info

precompile: install
	babel . --extensions .mjs --out-dir . $(BABEL_FLAGS)

install: node_modules $(GITFILES)

lint: force install
	eslint --cache --ext .mjs --report-unused-disable-directives $(ESLINT_FLAGS) .
	remark --quiet .

test: force compile
	mocha $(MOCHA_FLAGS)

test-debug: force compile
	mocha --inspect --inspect-brk $(MOCHA_FLAGS)

test-watch: force compile
	mocha --reporter min $(MOCHA_FLAGS) --watch

version:
	lerna version $(LERNA_FLAGS)

docs: compile
	esdoc

outdated:
	npm outdated || true
	lerna exec "npm outdated || true"

unlock: pristine
	rm -f package-lock.json packages/*/package-lock.json
	touch package.json

clean:
	rm -rf {.nyc_output,coverage,docs,.eslintcache}
	find . -name '*.log' -not -path '*/node_modules/*' -print -delete

distclean: clean
	rm -f $(shell ./utils/make/projectfiles.sh js)

pristine: distclean
	rm -rf node_modules packages/*/node_modules

.PHONY: force

-include local.mk
