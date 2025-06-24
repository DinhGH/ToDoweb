import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"


export async function POST(req: Request) {
  const body = await req.json()
  const { 
    title,
    description,
    category,
    date,
    start,
    end ,
    priority,
   } = body

  try {
    const newtask = await prisma.task.create({ data: { 
    title,
    description,
    category,
    date: new Date(date),
    start,
    end ,
    priority,
   }})
    return NextResponse.json(newtask)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 400 })
  }
}
