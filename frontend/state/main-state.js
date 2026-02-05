import { createState } from "./createState.js"
import { fetchJSON } from "./utils.js"

const initialState = {
  users : [],
  bareme : []
}

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUsersSummary() {
  state.users = await fetchJSON()
}

export async function addUserAction(user, data) {
  await fetchJSON(user + "/actions", {
    method : "POST",
    body : data
  })
  return getUsersSummary()
}

export async function addBaremeAction(data) {
  await fetchJSON("bareme", {
    method : "POST",
    body : data
  })
  return getBaremeActions()
}

export async function getBaremeActions() {
  state.bareme = await fetchJSON("bareme")
}

export async function removeBaremeAction(id) {
  await fetchJSON("bareme/" + id, {
    method : "DELETE"
  })
  return getBaremeActions();
}