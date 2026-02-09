import { updateUser, removeUser } from "../state.js"
import { withToast } from "../../../components/bm-toast.js"

const template = document.createElement("template")

template.innerHTML = `
  <form>
    <fieldset role="group">
      <input name="name" type="text" aria-label="nom de l'utilisateur" required>
      <input type="reset" value="Supprimer" class="icon-button">
      <input type="submit" value="Enregistrer" class="icon-button" hidden>
    </fieldset>
  </form>
`

class BmUserEdit extends HTMLElement {

  static observedAttributes = ["user"]

  #form
  #inputUser
  #inputSubmit
  #inputReset

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
    this.#form = this.querySelector("form")
    this.#inputUser = this.#form.querySelector("input[name=name]")
    this.#inputSubmit = this.#form.querySelector("input[type=submit]")
    this.#inputReset = this.#form.querySelector("input[type=reset]")
  }

  get user() {
    return this.getAttribute("user")
  }

  get deletable() {
    return this.hasAttribute("deletable")
  }

  #update = () => {
    this.#inputUser.value = this.user
    this.#inputReset.hidden = !this.deletable
  }

  #handleSubmit = e => {
    e.preventDefault()
    const data = new FormData(this.#form)
    withToast(() => updateUser(this.user, data))
  }

  #handleRemove = e => {
    e.preventDefault()
    withToast(() => removeUser(this.user))
  }

  #handleInput = () => {
    if (this.user === this.#inputUser.value) {
      this.#inputSubmit.hidden = true
      this.#inputReset.hidden = !this.deletable
    } else {
      this.#inputSubmit.hidden = false
      this.#inputReset.hidden = true
    }
  }

  connectedCallback() {
    this.#form.addEventListener("submit", this.#handleSubmit)
    this.#inputUser.addEventListener("input", this.#handleInput)
    this.#form.addEventListener("reset", this.#handleRemove)
    this.#update()
  }

  attributeChangedCallback() {
    this.#update()
  }
}

customElements.define("bm-user-edit", BmUserEdit)