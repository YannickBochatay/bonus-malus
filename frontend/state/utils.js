export const BACKEND_BASE_URL = "http://127.0.0.1:5000/"

export const [,user] = /user=([^&]+)/.exec(decodeURI(location.search)) ?? []

export async function fetchJSON(url = "", ...args) {
  const res = await globalThis.fetch(BACKEND_BASE_URL + url, ...args)
  const data = await res.json()
  if (!res.ok) throw new Error(data.details)
  return data
}