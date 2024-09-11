bin = ./node_modules/.bin

__blue = $$(tput setaf 4)
__normal = $$(tput sgr0)

title = $(shell pwd | xargs basename)
log = printf "$(__blue)$(title): $(__normal) %s\\n"

.PHONY: build
build: build-deploy build-build build-promote build-wait-for-checks

build-deploy: dist/deploy/index.js
build-build: dist/build/index.js
build-promote: dist/promote/index.js
build-wait-for-checks: dist/wait-for-checks/index.js

.PHONY: always
always:
	@true

dist/%/index.js: src/actions/%.ts always
	@$(log) "Building $$(basename $$(dirname $@))..."
	@rm -rf $$(dirname $@)
	@$(bin)/ncc build $< --out $$(dirname $@) -q

.PHONY: format
format:
	@$(log) "Checking formatting..."
	@$(bin)/biome check . --linter-enabled=false --organize-imports-enabled=true

.PHONY: format.fix
format.fix:
	@$(log) "Fixing formatting..."
	@$(bin)/biome check . --linter-enabled=false --organize-imports-enabled=true --write

.PHONY: typecheck
typecheck:
	@$(log) "Checking types..."
	@$(bin)/tsc --noEmit

.PHONY: check
check: format typecheck 

.PHONY: fix
fix: format.fix
