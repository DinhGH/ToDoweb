import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { start: "asc" } })
  return NextResponse.json(tasks)
}
