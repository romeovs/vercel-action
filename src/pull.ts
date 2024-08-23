import { promises as fs } from "node:fs"

import * as core from "@actions/core"
import * as exec from "@actions/exec"


type PullOptions = {
	cwd: string
	production: boolean
	token: string
	orgId: string
	projectId: string
}

export async function pull(options: PullOptions) {
	const { cwd, token, production, orgId, projectId } = options
	const env = production ? "production" : "development"
	const args = ["pull", "--yes", "--token", token, "--environment", env]

	if (await exists(`.vercel/.env.${env}.local`)) {
		core.info(".vercel directory already exists, skipping pull")
		return
	}

	core.exportVariable("VERCEL_ORG_ID", orgId)
	core.exportVariable("VERCEL_PROJECT_ID", projectId)

	await exec.exec("vercel", args, { cwd })
}

async function exists(path: string) {
	try {
		await fs.stat(path)
		return true
	} catch (error) {
		return false
	}
}
