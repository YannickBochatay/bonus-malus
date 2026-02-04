import { removeAction } from "../state/user-state.js"

const template = document.createElement("template")

template.innerHTML = `
  <td></td>
  <td></td>
  <td></td>
  <td>
    <button class="outline secondary icon-button">✗</button>
  </td>
`

class BmAction extends HTMLTableRowElement {

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  static observedAttributes = ["id", "action", "date", "valeur"]

  get action() { return this.getAttribute("action") }
  set action(value) { this.setAttribute("action", value) }

  get date() { return this.getAttribute("date") }
  set date(value) { this.setAttribute("date", value) }

  get valeur() { return this.getAttribute("valeur") }
  set valeur(value) { this.setAttribute("valeur", value) }

  #update() {
    this.children[0].textContent = this.action
    this.children[1].textContent = this.date
    this.children[2].textContent = this.valeur
  }

  #handleRemove = () => removeAction(this.id)

  connectedCallback() {
    this.#update()
    this.querySelector("button").addEventListener("click", this.#handleRemove)
  }

  attributeChangedCallback() {
    this.#update()
  }
}

customElements.define("bm-action", BmAction, { extends : "tr" })