import type { Env } from "../type/env";

export function getDB(env: Env): D1Database {
  return env.nutriplan_db;
}
