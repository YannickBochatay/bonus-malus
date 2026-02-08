import "./bm-depense.js"
import "./bm-depense-add.js"
import { PAGE_LENGTH } from "../state/utils.js"
import { state, onStateChange, offStateChange, getUserDepenses } from "../state/user-state.js"

const template = document.createElement("template")

template.innerHTML = `
  <bm-depense-add></bm-depense-add>
  <table>
    <thead>
      <tr>
        <th scope="col">Objet</th>
        <th scope="col">Date</th>
        <th scope="col">Valeur</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
`

class BmDepenses extends HTMLElement {

  #pendingRequest

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }  

  #update = () => {
    const tbody = this.querySelector("tbody")

    for (const [index, depense] of state.depenses.entries()) {

      const tr = tbody.children[index] ?? document.createElement("tr", { is : "bm-depense" })

      if (depense?.id) tr.id = depense.id
      else tr.removeAttribute("id")

      tr.descript = depense?.descript ?? ""
      tr.date = depense?.date ?? ""
      tr.cout = depense?.cout ?? ""

      if (!tr.parentNode) tbody.appendChild(tr)
    }

    while (tbody.children.length > state.depenses.length) tbody.lastElementChild.remove()

    this.#loadNearestItems()
  }

  #loadNearestItems = () => {
    if (this.#pendingRequest) return this.#pendingRequest.then(this.#loadNearestItems)

    const firstEmptyRow = this.querySelector("tbody tr:not([id])")

    if (!firstEmptyRow) return

    const top = firstEmptyRow.getBoundingClientRect().top

    if (top && top < innerHeight + 200) {
      const nextPage = Math.floor(firstEmptyRow.sectionRowIndex / PAGE_LENGTH) + 1
      this.#pendingRequest = getUserDepenses(nextPage).then(() => this.#pendingRequest = null)      
    }
  }

  async connectedCallback() {
    onStateChange("depenses", this.#update)
    window.addEventListener("scroll", this.#loadNearestItems)
    getUserDepenses()
  }

  disconnectedCallback() {
    offStateChange("depenses", this.#update)
    window.removeEventListener("scroll", this.#loadNearestItems)
  }
}

customElements.define("bm-depenses", BmDepenses)