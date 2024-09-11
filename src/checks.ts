import * as core from "@actions/core"

import { deployment } from "./deployment"

type ChecksOptions = {
	token: string
	orgId: string
	deploymentIdOrUrl: string
}

const WAIT_TIME = 1000
const TIMEOUT = 60 * 1000

export async function checks(options: ChecksOptions): Promise<void> {
	const start = Date.now()

	for (;;) {
		if (Date.now() - start > TIMEOUT) {
			throw new Error("Checks timed out")
		}

		await delay(WAIT_TIME)

		const info = await deployment(options)
		core.info(`Checks state: ${info.checksState}`)

		if (info.checksState === "completed") {
			if (info.checksConclusion === "succeeded") {
				return
			}

			throw new Error(`Checks failed: ${info.checksConclusion}`)
		}
	}
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
