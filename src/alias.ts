import * as core from "@actions/core"
import * as exec from "@actions/exec"
import * as github from "@actions/github"

type AliasOptions = {
	deploymentUrl: string
	domains: string
	alias: string
	cwd: string
	token: string
	orgId: string
	projectId: string
}

export async function alias(options: AliasOptions) {
	const { deploymentUrl, cwd, token, orgId, projectId, domains, alias } = options

	const aliases = parseAliases(domains)
	const domain = aliases[alias]

	if (!domain) {
		core.info(`No alias was found with the name ${alias}, skipping...`)
		core.debug(`The github-provided ref is: ${github.context.ref}`)
		return
	}

	core.info(`Aliasing deployment ${deploymentUrl} to ${domain}`)

	const args: string[] = [
		"alias",
		"set",
		"--token",
		token,
		"--scope",
		orgId,
		deploymentUrl,
		domain,
	]

	core.exportVariable("VERCEL_ORG_ID", orgId)
	core.exportVariable("VERCEL_PROJECT_ID", projectId)

	await exec.exec("vercel", args, { cwd })
}

type Aliases = {
	[branch: string]: string
}

function parseAliases(domains: string) {
	const aliases: Aliases = {}
	for (const line of domains.split("\n")) {
		const [branch, domain] = line.trim().split("=")
		if (!branch || !domain) {
			continue
		}
		aliases[branch] = domain
	}

	return aliases
}
