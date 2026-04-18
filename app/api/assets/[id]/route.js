import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
    })

    if (!asset) {
      return NextResponse.json(
        { message: "Asset not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(asset, { status: 200 })
  } catch (error) {
    console.error("GET /api/assets/[id] error:", error)
    return NextResponse.json(
      { message: "Failed to fetch asset" },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()

    const updatedAsset = await prisma.asset.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updatedAsset, { status: 200 })
  } catch (error) {
    console.error("PATCH /api/assets/[id] error:", error)
    return NextResponse.json(
      { message: "Failed to update asset" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.asset.delete({
      where: { id: params.id },
    })

    return NextResponse.json(
      { message: "Asset deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("DELETE /api/assets/[id] error:", error)
    return NextResponse.json(
      { message: "Failed to delete asset" },
      { status: 500 }
    )
  }
}
