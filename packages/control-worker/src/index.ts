import { run } from "graphile-worker";
import { loadEnvConfig } from "./utils/env";

async function main() {
  loadEnvConfig();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for control-worker");
  }

  await run({
    connectionString,
    concurrency: Number(process.env.WORKER_CONCURRENCY || 5),
    schema: process.env.WORKER_SCHEMA || "graphile_worker",
    noHandleSignals: false,
    pollInterval: 1000,
    taskList: await import("./tasks/registry"),
  });
}

main().catch((err) => {
  console.error("control-worker failed", err);
  process.exit(1);
});
