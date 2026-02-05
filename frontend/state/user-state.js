import { createState } from "./createState.js"
import { user, fetchJSON } from "./utils.js"

const initialState = {
  actions : [],
  depenses : []
}

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUserActions() {
  state.actions = await fetchJSON(user + "/actions")
}

export async function getUserDepenses() {
  state.depenses = await fetchJSON(user + "/depenses")
}

export async function addDepense(data) {
  await fetchJSON(user + "/depenses", {
    method : "POST",
    body : data
  })
  return getUserDepenses()
}

async function remove(type, id) {
  const res = await fetchJSON(user + "/" + type + "/" + id, {
    method : "DELETE"
  })
  return res;
}

export async function removeAction(id) {
  await remove("actions", id)
  return getUserActions()
}

export async function removeDepense(id) {
  await remove("depenses", id)
  return getUserDepenses()
}
