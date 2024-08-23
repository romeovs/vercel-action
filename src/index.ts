import * as core from "@actions/core"

import * as inputs from "./inputs"

import { deploy } from "./deploy"
import { inspect } from "./inspect"
import { pull } from "./pull"
import { run } from "./run"

run(async function main() {
	const production = inputs.boolean("production")
	const prebuilt = inputs.boolean("prebuilt")

	const cwd = inputs.string("working-directory")
	const token = inputs.string("vercel-token", true)
	const orgId = inputs.string("vercel-org-id", true)
	const projectId = inputs.string("vercel-project-id", true)

	if (production) {
		core.info("Deploying to production...")
	} else {
		core.info("Deploying to development...")
	}

	await pull({
		cwd,
		production,
		token,
		orgId,
		projectId,
	})
	const { deploymentUrl } = await deploy({
		cwd,
		production,
		prebuilt,
		orgId,
		projectId,
		token,
	})
	await inspect({
		deploymentUrl,
		cwd,
		orgId,
		projectId,
		token,
	})
})
