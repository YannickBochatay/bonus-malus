import "./bm-bareme-action.js"
import "./bm-bareme-add.js"
import { state, getBaremeActions, onStateChange, offStateChange } from "../state.js"

getBaremeActions()

const template = document.createElement("template")

template.innerHTML = `
  <table>
    <thead>
      <tr>
        <th scope="col">Action</th>
        <th scope="col">Valeur</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
  <bm-bareme-add id="form_new"></bm-bareme-add>
  
`

class BmBareme extends HTMLElement {

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #update = () => {
    const tbody = this.querySelector("tbody")

    for (const [index, action] of state.bareme.entries()) {
      const tr = tbody.children[index] ?? document.createElement("tr", { is : "bm-bareme-action" })

      tr.id = action.id
      tr.action = action.action
      tr.valeur = action.valeur

      if (!tr.parentNode) tbody.append(tr)
    }

    while (tbody.children.length > state.bareme.length) tbody.lastElementChild.remove()
  }

  connectedCallback() {
    this.#update()
    onStateChange("bareme", this.#update)
  }

  disconnectedCallback() {
    offStateChange("bareme", this.#update)
  }
}

customElements.define("bm-bareme", BmBareme)