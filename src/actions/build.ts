import { promises as fs } from "node:fs"

import * as core from "@actions/core"
import * as exec from "@actions/exec"

import * as inputs from "~/inputs"
import { run } from "~/run"

run(async function main() {
	const production = inputs.boolean("production")
	const cwd = inputs.string("working-directory")
	const token = inputs.string("vercel-token", true)
	const orgId = inputs.string("vercel-org-id", true)
	const projectId = inputs.string("vercel-project-id", true)

	if (production) {
		core.info("Building for production...")
	} else {
		core.info("Building for development...")
	}

	await pull({
		cwd,
		production,
		token,
		orgId,
		projectId,
	})
	await build({
		cwd,
		production,
		token,
	})
})

type BuildOptions = {
	cwd: string
	production: boolean
	token: string
}

async function build(options: BuildOptions) {
	const { production, cwd, token } = options

	const args: string[] = ["build", "--token", token]
	if (production) {
		args.push("--prod")
	}

	await exec.exec("vercel", args, { cwd })
}

type PullOptions = {
	cwd: string
	production: boolean
	token: string
	orgId: string
	projectId: string
}

async function pull(options: PullOptions) {
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
