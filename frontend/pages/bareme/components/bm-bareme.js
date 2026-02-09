import "./bm-bareme-action.js"
import "./bm-bareme-add.js"
import { state, getBaremeActions, onStateChange, offStateChange } from "../state.js"

getBaremeActions()

const style = document.createElement("style")

style.innerHTML = /*css*/`
  #new-bareme-action form {
    display:flex;
    align-items: center;
    flex-wrap:wrap;

    input {
      margin:0;
      &:nth-child(1) {
        flex:2;
        min-width:20ch;
      }
      &:nth-child(2) {
        flex:1;
        min-width:10ch;
      }
    }

    input[type=submit] {
      margin: calc(var(--pico-spacing)/ 2) var(--pico-spacing);
    }
  }
  bm-bareme tbody td:last-child {
    text-align: right;
  }
`

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
  <bm-bareme-add id="new-bareme-action"></bm-bareme-add>
  
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