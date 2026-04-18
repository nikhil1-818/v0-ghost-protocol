export async function getStats() {
  const res = await fetch("/api/stats", {
    method: "GET",
    cache: "no-store",
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch stats")
  }

  return data
}
