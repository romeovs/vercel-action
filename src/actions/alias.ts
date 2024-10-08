import * as inputs from "~/inputs"

import { alias } from "~/alias"
import { pull } from "~/pull"
import { run } from "~/run"

run(async function main() {
	const deploymentUrl = inputs.string("deployment-url", true)
	const production = inputs.boolean("production")
	const cwd = inputs.string("working-directory")
	const token = inputs.string("vercel-token", true)
	const orgId = inputs.string("vercel-org-id", true)
	const projectId = inputs.string("vercel-project-id", true)
	const domains = inputs.string("domains", true)
	const _alias = inputs.string("alias", true)

	await pull({
		cwd,
		production,
		token,
		orgId,
		projectId,
	})
	await alias({
		cwd,
		deploymentUrl,
		token,
		orgId,
		projectId,
		domains,
		alias: _alias,
	})
})
