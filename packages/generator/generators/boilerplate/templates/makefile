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


# Define files to be compiled with babel. We use find to get a list of all .mjs files from the
# current project, excluding results from node_modules and any potential dot dirs (.git etc.)
SRCFILES := $(shell find . -name '*.mjs' -not -path '*/node_modules/*' -not -path '*/.*')
# Build a list of our targets which should be "made" by make when compiling sources
OUTFILES := $(patsubst %.mjs, %.js, $(SRCFILES))

# Since this is the first target, Make will do this when make is invoked without arguments
all: precompile


# TASK DEFINITIONS

install: node_modules

precompile: install
	babel . --extensions .mjs --out-dir . $(FCOMPILE)

compile: $(OUTFILES)

# Delete all compiled files
distclean:
	rm -rf $(OUTFILES)


# GENERIC TARGETS

node_modules: package.json
	npm install $(FINSTALL) && touch node_modules

# Default compilation target for all source files
%.js: %.mjs node_modules babel.config.js
	babel $< --out-file $@ $(FCOMPILE)


# If this file exists, load it and add it to this makefile.
# Useful for defining per-developer variables. This file should not be under version control. ⚠️
-include local.mk
