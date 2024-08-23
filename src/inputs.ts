import * as core from "@actions/core"

export function string(name: string, required = false) {
	return core.getInput(name, { required })
}

export function boolean(name: string, required = false) {
	const value = core.getInput(name, { required })
	return value === "true" || value === "1"
}
