# Defining shell is necessary in order to modify PATH
SHELL := sh
export PATH := node_modules/.bin/:$(PATH)
export NODE_OPTIONS := --trace-deprecation

# Modify these variables in local.mk to add flags to the commands, ie.
# FTEST += --reporter nyan
# Now mocha will be invoked with the extra flag and will show a nice nyan cat as progress bar 🎉
FTEST :=
FCOMPILE :=
FLINT :=
FINSTALL :=

SRCFILES := $(shell find . -name '*.mjs' -not -path '*/node_modules/*' -not -path './.git/*' -not -path '**/generators/**/templates/*')
OUTFILES := $(patsubst %.mjs, %.js, $(SRCFILES))

# Do this when make is invoked without targets
all: precompile


# GENERIC TARGETS

node_modules: package.json
	npm install $(FINSTALL) && lerna bootstrap && touch node_modules

# Default compilation target for all source files
%.js: %.mjs node_modules babel.config.js
	babel $< --out-file $@ $(FCOMPILE)

coverage/lcov.info: $(OUTFILES)
	nyc mocha $(FTEST)


# TASK DEFINITIONS

compile: $(OUTFILES)

coverage: coverage/lcov.info

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

docs: compile
	esdoc

outdated:
	npm outdated || true
	lerna exec "npm outdated || true"

unlock: pristine
	rm package-lock.json packages/*/package-lock.json
	touch package.json

clean:
	rm -rf {.nyc_output,coverage,docs}
	find . -name '*.log' -print -delete

distclean: clean
	find . -name "*.js" \
		-not -path "*/node_modules/*" -not -path "*/.git/*" \
		-not -name ".*.js" -not -name "babel.config.js" \
		-print -delete

pristine: distclean
	rm -rf node_modules packages/*/node_modules

.PHONY: force

-include local.mk
