import * as core from "@actions/core"

import * as inputs from "~/inputs"

import { checks } from "~/checks"
import { run } from "~/run"

run(async function main() {
	const token = inputs.string("vercel-token", true)
	const orgId = inputs.string("vercel-org-id", true)
	const deploymentUrl = inputs.string("deployment-url", true)

	try {
		await checks({
			token,
			orgId,
			deploymentIdOrUrl: deploymentUrl,
		})
		core.info("Checks completed successfully")
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(`Checks failed: ${error.message}`)
			return
		}
		throw error
	}
})
