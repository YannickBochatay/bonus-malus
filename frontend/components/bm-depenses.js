import "./bm-depense.js"
import "./bm-depense-add.js"
import { PAGE_LENGTH } from "../state/utils.js"
import { state, onStateChange, offStateChange, getUserDepenses } from "../state/user-state.js"

getUserDepenses()

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

      if (depense) {
        tr.id = depense.id
        tr.descript = depense.descript
        tr.date = depense.date
        tr.cout = depense.cout
      }

      if (!tr.parentNode) tbody.appendChild(tr)
    }

    while (tbody.children.length > state.depenses.length) tbody.lastElementChild.remove()
  }

  #handleScroll = async() => {
    if (this.#pendingRequest) return this.#pendingRequest.then(this.#handleScroll)

    const firstEmptyRow = this.querySelector("tbody tr:not([id])")

    if (firstEmptyRow) {
      const offset = window.innerHeight - firstEmptyRow.getBoundingClientRect().top

      if (offset > -200 && !this.#pendingRequest) {
        const nextPage = Math.floor(firstEmptyRow.sectionRowIndex / PAGE_LENGTH) + 1
        this.#pendingRequest = getUserDepenses(nextPage)
        await this.#pendingRequest
        this.#pendingRequest = null
      }
    }
  }

  connectedCallback() {
    this.#update()
    onStateChange("depenses", this.#update)
    window.addEventListener("scroll", this.#handleScroll)
  }

  disconnectedCallback() {
    offStateChange("depenses", this.#update)
    window.removeEventListener("scroll", this.#handleScroll)
  }
}

customElements.define("bm-depenses", BmDepenses)