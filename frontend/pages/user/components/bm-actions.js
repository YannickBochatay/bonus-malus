import "./bm-action.js"
import "./bm-action-add.js"
import { PAGE_LENGTH } from "../../../lib/utils.js"
import { state, onStateChange, offStateChange, getUserActions } from "../state.js";

const template = document.createElement("template")

template.innerHTML = `
  <bm-action-add></bm-action-add>
  <table>
    <thead>
      <tr>
        <th scope="col">Action</th>
        <th scope="col">Date</th>
        <th scope="col">Valeur</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
`

class BmActions extends HTMLElement {

  #pendingRequest

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #update = () => {
    const tbody = this.querySelector("tbody")

    for (const [index, action] of state.actions.entries()) {
      const tr = tbody.children[index] ?? document.createElement("tr", { is : "bm-action" })

      if (action?.id) tr.id = action.id
      else tr.removeAttribute("id")

      tr.action = action?.action ?? ""
      tr.date = action?.date ?? ""
      tr.valeur = action?.valeur ?? ""

      if (!tr.parentNode) tbody.appendChild(tr)
    }

    while (tbody.children.length > state.actions.length) tbody.lastElementChild.remove()

    this.#loadNearestItems()
  }

  #loadNearestItems = () => {
    if (this.#pendingRequest) return this.#pendingRequest.then(this.#loadNearestItems)

    const firstEmptyRow = this.querySelector('tbody tr:not([id])')

    if (!firstEmptyRow) return

    const top = firstEmptyRow.getBoundingClientRect().top

    if (top && top < innerHeight + 200) {
      const nextPage = Math.floor(firstEmptyRow.sectionRowIndex / PAGE_LENGTH) + 1
      this.#pendingRequest = getUserActions(nextPage).then(() => this.#pendingRequest = null)
    }
  }

  connectedCallback() {
    onStateChange("actions", this.#update)
    window.addEventListener("scroll", this.#loadNearestItems)
    getUserActions()
  }

  disconnectedCallback() {
    offStateChange("actions", this.#update)
    window.removeEventListener("scroll", this.#loadNearestItems)
  }
}

customElements.define("bm-actions", BmActions)