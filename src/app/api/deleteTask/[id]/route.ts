import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xoá thành công" });

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error occurred' }, { status: 400 });
  }
}
