import { user, createState, fetchJSON, PAGE_LENGTH } from "../../utils.js"

const initialState = {
  actions : [],
  depenses : []
}

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUserActions(page = 1) {
  const { count, list } = await fetchJSON(`${user}/actions?p=${page}`)

  const actions = (state.actions.length === count) ? state.actions : new Array(count)

  const index = (page - 1) * PAGE_LENGTH
  state.actions = actions.toSpliced(index, PAGE_LENGTH, ...list)
}

export async function getUserDepenses(page = 1) {
  const { count, list } = await fetchJSON(`${user}/depenses?p=${page}`)

  const depenses = (state.depenses.length === count) ? state.depenses : new Array(count)

  const index = (page - 1) * PAGE_LENGTH
  state.depenses = depenses.toSpliced(index, PAGE_LENGTH, ...list)
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
