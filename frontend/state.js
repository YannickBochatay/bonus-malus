export const BACKEND_BASE_URL = "http://127.0.0.1:5000/"

export async function getUsersSummary() {
  const res = await fetch(BACKEND_BASE_URL)
  return await res.json()
}

export function addUserAction(user, data) {
  return fetch(BACKEND_BASE_URL + user + "/actions", {
    method : "POST",
    body : data
  })
}

export async function getActions(type) {
  const res = await fetch(BACKEND_BASE_URL + type)
  return await res.json()
}