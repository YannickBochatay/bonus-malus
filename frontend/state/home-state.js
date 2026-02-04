import { createState } from "./createState.js"
import { BACKEND_BASE_URL } from "./utils.js"

const initialState = {
  users : [],
  bareme : []
}

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUsersSummary() {
  const res = await fetch(BACKEND_BASE_URL)
  state.users = await res.json()
}

export async function addUserAction(user, data) {
  const res = await fetch(BACKEND_BASE_URL + user + "/actions", {
    method : "POST",
    body : data
  })
  if (!res.ok) {
    let msg = await res.json()
    throw new Error(msg.details)
  }
  return getUsersSummary()
}

export async function getActions() {
  const res = await fetch(BACKEND_BASE_URL + "bareme")
  state.bareme = await res.json()
}