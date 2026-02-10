import { createState, fetchJSON } from "../../lib/utils.js"

const initialState = { bareme : [] }

export const { state, onStateChange, offStateChange } = createState(initialState)

export async function getBaremeActions() {
  state.bareme = await fetchJSON("bareme")
}

export async function addBaremeAction(data) {
  const msg = await fetchJSON("bareme", {
    method : "POST",
    body : data
  })
  await getBaremeActions()
  return msg
}

export async function removeBaremeAction(id) {
  const msg = await fetchJSON("bareme/" + id, {
    method : "DELETE"
  })
  await getBaremeActions();
  return msg
}