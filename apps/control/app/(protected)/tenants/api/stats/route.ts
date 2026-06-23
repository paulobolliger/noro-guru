import { NextResponse } from "next/server";
import { createDatabaseClient } from "@noro/db";

export async function GET() {
  const { client, close } = createDatabaseClient();
  try {
    const tenants = await client`
      SELECT id, status, plan 
      FROM platform.tenants
    `;

    const stats = {
      total: tenants?.length || 0,
      active: tenants?.filter((t: any) => t.status === "active").length || 0,
      trial: tenants?.filter((t: any) => t.plan === "trial").length || 0,
      inactive: tenants?.filter((t: any) => t.status === "inactive").length || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erro ao buscar tenants:", error);
    return NextResponse.json({ total: 0, active: 0, trial: 0, inactive: 0 }, { status: 500 });
  } finally {
    await close();
  }
}
