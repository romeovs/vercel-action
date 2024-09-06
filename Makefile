bin = ./node_modules/.bin

__blue = $$(tput setaf 4)
__normal = $$(tput sgr0)

title = $(shell pwd | xargs basename)
log = printf "$(__blue)$(title): $(__normal) %s\\n"

.PHONY: build
build: build-deploy

.PHONY: build-deploy
build-deploy:
	@$(log) "Building..."
	@rm -rf dist/
	@$(bin)/ncc build src/actions/deploy.ts --out dist/deploy

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
