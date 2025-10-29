import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

export function loadEnvConfig() {
  const envPath = process.env.WORKER_ENV_PATH || path.resolve(process.cwd(), "../../.env.local");
  const result = dotenv.config({ path: envPath, override: false });
  if (result.error) {
    console.warn("control-worker could not load env file", result.error);
  } else {
    console.info(`control-worker loaded env from ${envPath}`);
  }
}