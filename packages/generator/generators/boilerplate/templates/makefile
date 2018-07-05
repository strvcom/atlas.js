# Defining shell is necessary in order to modify PATH
SHELL := sh
# Allow make to recognise binaries provided via npm without using full path into node_modules
export PATH := node_modules/.bin/:$(PATH)

# Modify these variables in local.mk to add flags to the commands, ie.
# FINSTALL += --prefer-offline
# Now, npm will be invoked with the specified flag and will try to install packages from cache if
# they are available.
FINSTALL :=
FCOMPILE :=

# Build a list of our targets which should be "made" by make when compiling sources
JSFILES := $(patsubst %.mjs, %.js, $(shell util/make/files mjs))

# Since this is the first target, Make will do this when make is invoked without arguments
all: precompile


# TASK DEFINITIONS

install: node_modules

precompile: install
	babel . --extensions .mjs --out-dir . $(FCOMPILE)

compile: $(JSFILES)

# Delete all compiled files
distclean:
	rm $(shell ./util/make/files js) || true


# GENERIC TARGETS

node_modules: package.json
	npm install $(FINSTALL) && touch node_modules

# Default compilation target for all source files
%.js: %.mjs node_modules babel.config.js
	babel $< --out-file $@ $(FCOMPILE)


# If this file exists, load it and add it to this makefile.
# Useful for defining per-developer variables. This file should not be under version control. ⚠️
-include local.mk
