import { BACKEND_BASE_URL } from "../config.js"
export * from "../config.js"

export { createState } from "./createState.js"

export const [,user] = /user=([^&]+)/.exec(decodeURI(location.search)) ?? []

export async function fetchJSON(url = "", options = {}) {
  const res = await fetch(BACKEND_BASE_URL + url, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.details)
  if (["POST", "PUT", "DELETE"].includes(options.method)) return data.details
  else return data
}
