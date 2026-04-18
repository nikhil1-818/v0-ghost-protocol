import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.asset.deleteMany()

  const assets = [
    {
      type: "server",
      model: "Dell PowerEdge R740",
      serial: "SRV-2024-XK7891",
      status: "complete",
      location: "New York, NY",
      pickupDate: "2024-01-15",
      completedDate: "2024-01-22",
      materials: JSON.stringify({
        gold: 0.34,
        silver: 2.1,
        palladium: 0.12,
        copper: 145,
      }),
    },
    {
      type: "storage",
      model: "NetApp FAS8200",
      serial: "NAS-2023-RT4521",
      status: "recovering",
      location: "San Francisco, CA",
      pickupDate: "2024-01-18",
      completedDate: null,
      materials: null,
    },
    {
      type: "desktop",
      model: "HP EliteDesk 800 G6",
      serial: "DKT-2024-PQ1234",
      status: "sanitizing",
      location: "Chicago, IL",
      pickupDate: "2024-01-20",
      completedDate: null,
      materials: null,
    },
    {
      type: "laptop",
      model: "Lenovo ThinkPad X1",
      serial: "LPT-2024-MN5678",
      status: "in_transit",
      location: "Boston, MA",
      pickupDate: "2024-01-22",
      completedDate: null,
      materials: null,
    },
    {
      type: "network",
      model: "Cisco Catalyst 9300",
      serial: "NET-2024-ZX9012",
      status: "pending_pickup",
      location: "Seattle, WA",
      pickupDate: null,
      completedDate: null,
      materials: null,
    },
  ]

  for (const asset of assets) {
    await prisma.asset.create({
      data: asset,
    })
  }

  console.log("Seed completed successfully.")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
