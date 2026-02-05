import { removeBaremeAction } from "../state/main-state.js"
import { withToast } from "./bm-toast.js"

const template = document.createElement("template")

template.innerHTML = `
  <td></td>
  <td></td>
  <td>
    <button class="outline secondary icon-button">✗</button>
  </td>
`

class BmBaremeAction extends HTMLTableRowElement {

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  static observedAttributes = ["id", "action", "valeur"]

  get action() { return this.getAttribute("action") }
  set action(value) { this.setAttribute("action", value) }

  get valeur() { return this.getAttribute("valeur") }
  set valeur(value) { this.setAttribute("valeur", value) }

  #update() {
    this.children[0].textContent = this.action
    this.children[1].textContent = this.valeur
  }

  #handleRemove = () => withToast(() => removeBaremeAction(this.id))

  connectedCallback() {
    this.#update()
    this.querySelector("button").addEventListener("click", this.#handleRemove)
  }

  attributeChangedCallback() {
    this.#update()
  }
}

customElements.define("bm-bareme-action", BmBaremeAction, { extends : "tr" })