import { user, createState, fetchJSON, PAGE_LENGTH } from "./utils.js"

const initialState = {
  actions : [],
  depenses : []
}

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getUserActions(page = 1) {
  const { count, list } = await fetchJSON(`${user}/actions?p=${page}`)

  if (state.actions.length === 0) state.actions = new Array(count)

  const index = (page - 1) * PAGE_LENGTH
  const actions = state.actions.toSpliced(index, PAGE_LENGTH, ...list)
  if (actions.length > count) actions.splice(count, count - actions.length)
  if (count > actions.length) actions.concat(new Array(count - actions.length))

  state.actions = actions
}

export async function getUserDepenses(page = 1) {
  const { count, list } = await fetchJSON(`${user}/depenses?p=${page}`)

  if (state.depenses.length === 0) state.depenses = new Array(count)

  const index = (page - 1) * PAGE_LENGTH
  state.depenses = state.depenses.toSpliced(index, PAGE_LENGTH, ...list)
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

export async function removeAction(id, page = 1) {
  const msg = await remove("actions", id)
  await getUserActions(page)
  return msg
}

export async function removeDepense(id, page = 1) {
  const msg = await remove("depenses", id)
  await getUserDepenses(page)
  return msg
}
