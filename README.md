# Vercel Actions

This repository contains a collection of GitHub Actions for Vercel
managing building and deploying your projects to Vercel, all using GitHub actions.

## Actions

### `@romeovs/vercel-action/build`

Build your project using `vercel build`.

```yaml
- name: Build
  uses: romeovs/vercel-action/build@v3
  with:
    production: ${{ github.ref == 'refs/heads/main' }}
    vercel-org-id: team_rAg...
    vercel-project-id: prj_h0z...
    vercel-token: xtxK...
  env:
    # Environment variables are passed to the build
    MY_SECRET: ${{ secrets.MY_SECRET }}
```

### `@romeovs/vercel-action/deploy`

Deploy your project using `vercel deploy`.

```yaml
- name: Deploy
  uses: romeovs/vercel-action/deploy@v3
  with:
    production: ${{ github.ref == 'refs/heads/main' }}
    prebuilt: "true"
    promote: "false"
    vercel-org-id: team_rAg...
    vercel-project-id: prj_h0z...
    vercel-token: xtxK...
```

### `@romeovs/vercel-action/wait-for-checks`

Await the deployment checks.

```yaml
- name: Wait for checks
  uses: romeovs/vercel-action/wait-for-checks@v3
  with:
    deployment-url: ${{ steps.deploy.outputs.deployment-url }}
    vercel-org-id: team_rAg...
    vercel-project-id: prj_h0z...
    vercel-token: xtxK...
```

### `@romeovs/vercel-action/promote`

Promote a deployment to production.

```yaml
- name: Promote
  uses: romeovs/vercel-action/promote@v3
  with:
    deployment-url: ${{ needs.deploy.outputs.deployment-url }}
    production: ${{ github.ref == 'refs/heads/main' }}
    vercel-org-id: team_rAg...
    vercel-project-id: prj_h0z...
    vercel-token: xtxK...
```


### `@romeovs/vercel-action/alias`

Alias a deployment to a domain.


```yaml
- name: Alias
  uses: romeovs/vercel-action/alias@v3
  with:
    deployment-url: ${{ needs.deploy.outputs.deployment-url }}
    alias: ${{ github.head_ref }}
    domains: |
      preview=preview.example.com
      staging=staging.example.com
    vercel-org-id: team_rAg...
    vercel-project-id: prj_h0z...
    vercel-token: xtxK...
```
