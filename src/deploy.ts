import * as exec from "@actions/exec"
import * as core from "@actions/core"
import * as github from "@actions/github"

type DeployOptions = {
	cwd: string
	production: boolean
	prebuilt: boolean
	token: string
	orgId: string
	projectId: string
}

export async function deploy(options: DeployOptions) {
	const { production, prebuilt, cwd, token, orgId, projectId } = options
	const { context } = github

	const args: string[] = ["deploy", "--token", token, "--no-wait", "--archive=tgz"]
	if (production) {
		args.push("--prod")
	}
	if (prebuilt) {
		args.push("--prebuilt")
	}

	const meta = {
		"commit-sha": context.sha,
		"commit-author": context.actor,
		"github-org": context.repo.owner,
		"github-repo": context.repo.repo,
	}

	for (const k in meta) {
		args.push("-m", `${k}=${meta[k as keyof typeof meta]}`)
	}

	core.exportVariable("VERCEL_ORG_ID", orgId)
	core.exportVariable("VERCEL_PROJECT_ID", projectId)

	let stdout = ""
	let stderr = ""

	await exec.exec("vercel", args, {
		cwd,
		listeners: {
			stdout(data) {
				stdout += data.toString()
			},
			stderr(data) {
				stderr += data.toString()
			},
		},
	})

	const inspectUrl = stderr.match(" Inspect: ([^[]*) [.*]$")?.[1]
	const deploymentUrl = stdout

	if (inspectUrl) {
		core.info(`Inspect the deployment at: ${inspectUrl}`)
	}
	if (deploymentUrl) {
		core.info(`Open the deployment at:    ${deploymentUrl}`)
	}

	return {
		inspectUrl,
		deploymentUrl
	}
}
