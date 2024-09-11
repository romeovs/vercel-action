type DeploymentOptions = {
	token: string
	orgId: string
	deploymentIdOrUrl: string
}

type DeploymentInfo = {
	checksState: "registered" | "running" | "completed"
	checksConclusion: "succeeded" | "failed" | "skipped" | "canceled"
}

export async function deployment(options: DeploymentOptions) {
	const stripped = options.deploymentIdOrUrl.replace(/^https:\/\//, "")
	const res = await fetch(
		`https://api.vercel.com/v12/deployments/${stripped}?teamId=${options.orgId}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${options.token}`,
			},
		},
	)

	if (!res.ok) {
		throw new Error(`Failed to fetch deployment: ${res.status}`)
	}

	const body = await res.json()
	return body as DeploymentInfo
}
