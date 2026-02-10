import { createState, fetchJSON } from "../../lib/utils.js"

const initialState = {
  users : [],
  bareme : []
}

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUsersSummary() {
  state.users = await fetchJSON()
}

export async function updateUser(user, data) {
  const msg = await fetchJSON(user, {
    method : "PUT",
    body : data
  })
  await getUsersSummary()
  return msg
}


export async function addUser(data) {
  const msg = await fetchJSON("users", {
    method : "POST",
    body : data
  })
  await getUsersSummary()
  return msg
}

export async function removeUser(user) {
  const msg = await fetchJSON(user, { method : "DELETE" })
  await getUsersSummary()
  return msg
}

export async function addUserAction(user, data) {
  const msg = await fetchJSON(user + "/actions", {
    method : "POST",
    body : data
  })
  await getUsersSummary()
  return msg
}

export async function addBaremeAction(data) {
  const msg = await fetchJSON("bareme", {
    method : "POST",
    body : data
  })
  await getBaremeActions()
  return msg
}

export async function getBaremeActions() {
  state.bareme = await fetchJSON("bareme")
}

export async function removeBaremeAction(id) {
  const msg = await fetchJSON("bareme/" + id, {
    method : "DELETE"
  })
  await getBaremeActions();
  return msg
}