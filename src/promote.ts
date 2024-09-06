import * as core from "@actions/core"
import * as exec from "@actions/exec"

type PromoteOptions = {
	deploymentUrl: string
	cwd: string
	token: string
	orgId: string
	projectId: string
}

export async function promote(options: PromoteOptions) {
	const { deploymentUrl, cwd, token, orgId, projectId } = options

	const args: string[] = ["promote", "--token", token, deploymentUrl]

	core.exportVariable("VERCEL_ORG_ID", orgId)
	core.exportVariable("VERCEL_PROJECT_ID", projectId)

	await exec.exec("vercel", args, { cwd })
}
