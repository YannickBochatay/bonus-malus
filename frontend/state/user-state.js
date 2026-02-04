import { createState } from "./createState.js"
import { BACKEND_BASE_URL, user } from "./utils.js"

const initialState = {
  actions : [],
  depenses : []
}

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUserActions() {
  const res = await fetch(BACKEND_BASE_URL + user + "/actions")
  state.actions = await res.json()
}

export async function getUserDepenses() {
  const res = await fetch(BACKEND_BASE_URL + user + "/depenses")
  state.depenses = await res.json()
}

export async function addDepense(data) {
  const res = await fetch(BACKEND_BASE_URL + user + "/depenses", {
    method : "POST",
    body : data
  })
  if (!res.ok) {
    let msg = await res.json()
    throw new Error(msg.details)
  }
  return getUserDepenses()
}

async function remove(type, id) {
  const res = await fetch(BACKEND_BASE_URL + user + "/action/" + id, {
    method : "DELETE"
  })
  if (!res.ok) {
    let msg = await res.json()
    throw new Error(msg.details)
  }
  return res;
}

export async function removeAction(id) {
  await remove("action", id)
  return getUserActions()
}

export async function removeDepense(id) {
  await remove("depense", id)
  return getUserDepenses()
}
