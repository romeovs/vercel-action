import * as core from "@actions/core"

export async function run(fn: () => Promise<void>) {
	try {
		await fn()
	} catch (err) {
		if (err instanceof Error) {
			core.setFailed(err.message)
			return
		}
		core.setFailed("unknown error")
	}
}
