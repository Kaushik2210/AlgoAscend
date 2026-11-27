import { executionAvailable } from "@/lib/execution";

export function GET() {
  return Response.json({
    status:"ok",
    executionConfigured:executionAvailable(),
    revision:process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  },{headers:{"Cache-Control":"no-store"}});
}
