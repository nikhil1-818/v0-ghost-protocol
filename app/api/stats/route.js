import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const assets = await prisma.asset.findMany()

    const total = assets.length
    const inProgress = assets.filter(
      (a) => !["complete", "pending_pickup"].includes(a.status)
    ).length
    const completed = assets.filter((a) => a.status === "complete").length

    const goldRecovered = assets.reduce((acc, asset) => {
      const materials = asset.materials || {}
      return acc + (materials.gold || 0)
    }, 0)

    return NextResponse.json(
      {
        total,
        inProgress,
        completed,
        eWasteDiverted: 847.5,
        goldRecovered: Number(goldRecovered.toFixed(2)),
        co2Offset: 2.4,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET /api/stats error:", error)
    return NextResponse.json(
      { message: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
