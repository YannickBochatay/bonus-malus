import { PAGE_LENGTH } from "../state/utils.js"
import { removeDepense } from "../state/user-state.js"
import { withToast } from "./bm-toast.js"

const template = document.createElement("template")

template.innerHTML = `
  <td></td>
  <td></td>
  <td></td>
  <td>
    <button class="outline secondary icon-button">✗</button>
  </td>
`

class BmDepense extends HTMLTableRowElement {

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  static observedAttributes = ["id", "descript", "date", "cout"]

  get descript() { return this.getAttribute("descript") }
  set descript(value) { this.setAttribute("descript", value) }

  get date() { return this.getAttribute("date") }
  set date(value) { this.setAttribute("date", value) }

  get cout() { return this.getAttribute("cout") }
  set cout(value) { this.setAttribute("cout", value) }

  #update() {
    this.children[0].textContent = this.descript
    this.children[1].textContent = this.date
    this.children[2].textContent = this.cout
  }

  #handleRemove = () => {
    const currentPage = Math.floor(this.sectionRowIndex / PAGE_LENGTH) + 1
    withToast(() => removeDepense(this.id, currentPage))
  }

  connectedCallback() {
    this.#update()
    this.querySelector("button").addEventListener("click", this.#handleRemove)
  }

  attributeChangedCallback() {
    this.#update()
  }
}

customElements.define("bm-depense", BmDepense, { extends : "tr" })