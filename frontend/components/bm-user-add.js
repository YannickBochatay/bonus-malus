import { addUser } from "../state/main-state.js"
import { withToast } from "./bm-toast.js"

const template = document.createElement("template")

template.innerHTML = `
  <form>
    <label for="new_user">Ajouter un joueur ou joueuse</label>
    <fieldset role="group">
      <input name="user" type="text" id="new_user" required>
      <input type="submit" value="Ajouter" class="icon-button">
    </fieldset>
  </form>
`

class BmUserAdd extends HTMLElement {

  #form

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
    this.#form = this.querySelector("form")
  }

  #handleSubmit = e => {
    e.preventDefault()
    const data = new FormData(this.#form)
    withToast(() => addUser(data))
    this.#form.reset()
  }

  connectedCallback() {
    this.#form.addEventListener("submit", this.#handleSubmit)
  }
}

customElements.define("bm-user-add", BmUserAdd)