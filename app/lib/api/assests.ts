export interface AssetPayload {
  type: "server" | "desktop" | "laptop" | "storage" | "network"
  model: string
  serial: string
  location: string
  status?: "pending_pickup" | "in_transit" | "sanitizing" | "recovering" | "complete"
  pickupDate?: string
  completedDate?: string
  materials?: {
    gold?: number
    silver?: number
    palladium?: number
    copper?: number
  } | null
}

export async function getAssets(status?: string) {
  const query = status && status !== "all" ? `?status=${status}` : ""

  const res = await fetch(`/api/assets${query}`, {
    method: "GET",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch assets")
  }

  return res.json()
}

export async function getAssetById(id: string) {
  const res = await fetch(`/api/assets/${id}`, {
    method: "GET",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch asset")
  }

  return res.json()
}

export async function createAsset(payload: AssetPayload) {
  const res = await fetch("/api/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to create asset")
  }

  return data
}

export async function updateAsset(id: string, payload: Partial<AssetPayload>) {
  const res = await fetch(`/api/assets/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to update asset")
  }

  return data
}

export async function deleteAsset(id: string) {
  const res = await fetch(`/api/assets/${id}`, {
    method: "DELETE",
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete asset")
  }

  return data
}
