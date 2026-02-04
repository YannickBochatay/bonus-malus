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
  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #update = () => {
    const tbody = this.querySelector("tbody")

    for (const [index, action] of state.actions.entries()) {
      const tr = tbody.children[index] ?? document.createElement("tr", { is : "bm-action" })

      tr.id = action.id
      tr.action = action.action
      tr.date = action.date
      tr.valeur = action.valeur

      if (!tr.parentNode) tbody.appendChild(tr)
    }

    while (tbody.children.length > state.actions.length) tbody.lastElementChild.remove()
  }

  connectedCallback() {
    this.#update()
    onStateChange("actions", this.#update)
  }

  disconnectedCallback() {
    offStateChange("actions", this.#update)
  }
}

customElements.define("bm-actions", BmActions)