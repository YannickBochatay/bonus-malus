import { addBaremeAction } from "../state.js"
import { withToast } from "../../../components/bm-toast.js"

const style = document.createElement("style")

style.innerHTML = /*css*/`
  #new-bareme-action {
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
`

document.head.append(style)

const template = document.createElement("template")

template.innerHTML = `
  <form id="new-bareme-action">
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
    withToast(() => addBaremeAction(data))
    this.#form.reset()
  }

  connectedCallback() {
    this.#form.addEventListener("submit", this.#handleSubmit)
  }
}

customElements.define("bm-bareme-add", BmBaremeAdd)