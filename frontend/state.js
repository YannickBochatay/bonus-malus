import { createState, fetchJSON } from "./utils.js"

const initialState = { users : [], bareme : [] }

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUsersSummary() {
  state.users = await fetchJSON()
}

export async function getBaremeActions() {
  state.bareme = await fetchJSON("bareme")
}

export async function addUserAction(user, data) {
  const msg = await fetchJSON(user + "/actions", {
    method : "POST",
    body : data
  })
  await getUsersSummary()
  return msg
}

