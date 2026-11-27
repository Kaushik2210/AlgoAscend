# AlgoAscend on Vercel

The public site is [algoascend.vercel.app](https://algoascend.vercel.app). [View a hosted Java submission](screenshots/hosted-execution.png). Vercel builds the connected GitHub repository and deploys changes pushed to `main`.

## Hosted execution

Vercel injects the app's OIDC credential at runtime. Set `ALGO_CLOUD_SNAPSHOT` in the production environment to a toolchain snapshot from the same Vercel project. The application creates a fresh, non-persistent microVM for each Run or Submit request and stops it when the request finishes. Every case runs under an unprivileged user in a fresh Linux namespace with read-only toolchain mounts, writable temporary storage, and no mounted application code or credentials. The microVM denies outbound traffic during judging.

The launcher sets process, file, descriptor, execution-time, and output limits. C and Python commands get a 256 MiB virtual address-space limit per process. Java uses a 96 MiB maximum heap. The microVM also has a provider-enforced lifetime and memory limit. Output from hidden cases is suppressed in the app response.

The production firewall limits `/api/judge` to 10 requests per minute per IP. Vercel's sandbox quotas still apply. Local Docker and remote Judge0 remain available when the cloud snapshot is omitted. See [Vercel Sandbox quotas](https://vercel.com/docs/sandbox/pricing).

## Refresh the toolchain snapshot

Link the repository to the existing Vercel project. Pull the production environment to an ignored file, then run the snapshot builder:

```sh
vercel env pull .env.vercel.local --environment=production
node --env-file=.env.vercel.local scripts/prepare-cloud-sandbox.mjs
```

Set the printed snapshot ID as `ALGO_CLOUD_SNAPSHOT` in the Vercel production environment. Redeploy the intended commit for environment changes to take effect. Refresh the snapshot after editing the launcher, compiler setup, or Python execution supervisor. The snapshot builder installs the compilers before any learner code is present.

## Verify the deployment

```sh
node scripts/smoke-deployment.mjs https://algoascend.vercel.app
```

The smoke test checks service health, actual stdout, and hidden-case grading for C, Python, and Java. It also checks the read-only root and loopback-only network inside the execution namespace. Set `ALGO_EXPECTED_REVISION` to require an exact Git commit. `/api/health` reports configuration and revision. The smoke test exercises the execution path.

To roll back, promote the previous verified deployment in Vercel. Keep its snapshot available until the replacement passes the smoke test.
