import { user, createState, fetchJSON } from "./utils.js"

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
  const msg = await fetchJSON(user + "/depenses", {
    method : "POST",
    body : data
  })
  await getUserDepenses()
  return msg
}

async function remove(type, id) {
  return await fetchJSON(user + "/" + type + "/" + id, {
    method : "DELETE"
  })
}

export async function removeAction(id) {
  const msg = await remove("actions", id)
  await getUserActions()
  return msg
}

export async function removeDepense(id) {
  const msg = await remove("depenses", id)
  await getUserDepenses()
  return msg
}
