import { addBaremeAction } from "../state/main-state.js"

const template = document.createElement("template")

template.innerHTML = `
  <form>
    <input name="action" type="text" aria-label="nouvelle action" placeholder="Action" required>
    <input name="valeur" type="number" aria-label="nouvelle valeur" placeholder="Valeur" required>
    <input type="submit" value="+" class="icon-button">
  </form>
`

class BmBaremeAdd extends HTMLElement {

  #form

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
    this.#form = this.querySelector("form")
  }

  #handleSubmit = e => {
    e.preventDefault()
    const data = new FormData(this.#form)
    addBaremeAction(data)
    this.#form.reset()
  }

  connectedCallback() {
    this.#form.addEventListener("submit", this.#handleSubmit)
  }
}

customElements.define("bm-bareme-add", BmBaremeAdd)