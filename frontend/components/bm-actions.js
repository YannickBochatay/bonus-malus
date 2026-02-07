import "./bm-action.js"
import { PAGE_LENGTH } from "../state/utils.js"
import { state, onStateChange, offStateChange, getUserActions } from "../state/user-state.js";

getUserActions()

const template = document.createElement("template")

template.innerHTML = `
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

      if (action) {
        tr.id = action.id
        tr.action = action.action
        tr.date = action.date
        tr.valeur = action.valeur
      }

      if (!tr.parentNode) tbody.appendChild(tr)
    }

    while (tbody.children.length > state.actions.length) tbody.lastElementChild.remove()
  }

  #handleScroll = async() => {
    if (this.#pendingRequest) return this.#pendingRequest.then(this.#handleScroll)

    const firstEmptyRow = this.querySelector("tbody tr:not([id])")

    if (firstEmptyRow) {
      const top = firstEmptyRow.getBoundingClientRect().top

      if (top && (top < innerHeight + 200) && !this.#pendingRequest) {
        const nextPage = Math.floor(firstEmptyRow.sectionRowIndex / PAGE_LENGTH) + 1
        this.#pendingRequest = getUserActions(nextPage)
        await this.#pendingRequest
        this.#pendingRequest = null
      }
    }
  }

  connectedCallback() {
    this.#update()
    onStateChange("actions", this.#update)
    window.addEventListener("scroll", this.#handleScroll)
  }

  disconnectedCallback() {
    offStateChange("actions", this.#update)
    window.removeEventListener("scroll", this.#handleScroll)
  }
}

customElements.define("bm-actions", BmActions)