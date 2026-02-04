import "./bm-depense.js"
import "./bm-depense-add.js"
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

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }  

  #update = () => {
    const tbody = this.querySelector("tbody")

    for (const [index, depense] of state.depenses.entries()) {

      const tr = tbody.children[index] ?? document.createElement("tr", { is : "bm-depense" })

      tr.id = depense.id
      tr.descript = depense.descript
      tr.date = depense.date
      tr.cout = depense.cout

      if (!tr.parentNode) tbody.appendChild(tr)
    }

    while (tbody.children.length > state.depenses.length) tbody.lastElementChild.remove()
  }

  connectedCallback() {
    this.#update()
    onStateChange("depenses", this.#update)
  }

  disconnectedCallback() {
    offStateChange("depenses", this.#update)
  }
}

customElements.define("bm-depenses", BmDepenses)