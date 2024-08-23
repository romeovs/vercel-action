import * as exec from "@actions/exec"
import * as core from "@actions/core"

type InspectOptions = {
	deploymentUrl: string
	cwd: string
	token: string
	orgId: string
	projectId: string
}

export async function inspect(options: InspectOptions) {
	const { deploymentUrl, cwd, token, orgId, projectId } = options

	const args: string[] = ["inspect", "--token", token, "--wait", deploymentUrl]

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

	// TODO: check if the deployment is successful (status: READY)
}
