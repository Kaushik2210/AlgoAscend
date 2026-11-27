# Execution API

`POST /api/judge` accepts JSON with:

| Field | Values |
| --- | --- |
| `problemId` | An ID from the published problem library |
| `language` | `c`, `python`, or `java` |
| `source` | Nonblank source, up to 20,000 characters |
| `mode` | `run` for a custom input or `submit` for the problem suite |
| `stdin` | Up to 8,192 characters |

A completed request returns a verdict and individual case verdicts. A run shows the sample expectation when its input exactly matches the sample. Sample and custom runs can include output, compiler messages, and runtime metrics. Private case details stay out of the response. The initial repository fixtures are visible in this open-source checkout. A production competition needs its own private problem bank.

Error statuses are 400 for invalid input, 415 for invalid content type or cross-site requests, 429 for capacity or rate limits, 502 for an upstream error, and 503 when the judge is absent. An unauthenticated HTTP deployment requires perimeter access controls and shared rate limits before enabling execution publicly.

The application delegates execution to the [local Docker runner](LOCAL_RUNNER.md) or a configured Judge0 instance. The local runner creates a fresh sandbox for each test case. The browser verification suite covers actual execution and the unavailable-service fallback. A production deployment still needs acceptance checks on the actual infrastructure.
