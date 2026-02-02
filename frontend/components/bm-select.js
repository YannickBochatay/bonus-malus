import { getActions, addUserAction } from "../state.js";

const template = document.createElement('template');

template.innerHTML = `
  <form>
    <input type="hidden" name="joueur" value=""/>
    <select name="action" required>
      <option value="" disabled selected hidden>Ajouter</option>
    </select>
  </form>
`

class BmSelect extends HTMLElement {

  #form

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
    this.#form = this.querySelector('form')
  }

  async #setOptions() {
    const actions = await getActions(this.type)
    const options = []

    for (const action of actions) {
      const option = document.createElement("option")
      option.value = action.id
      option.textContent = `${action.action} (${action.valeur})`
      options.push(option)
    }

    this.querySelector("select").append(...options)
  }

  get user() {
    return this.getAttribute('user')
  }

  get type() {
    return this.getAttribute("type")
  }

  #handleSubmit = async () => {
    this.querySelector("input[name=joueur]").value = this.user

    try {
      await addUserAction(this.user, new FormData(this.#form))
      location.reload()
    } catch (e) {
      console.error(e)
    }
  }

  connectedCallback() {
    this.#form.addEventListener("change", this.#handleSubmit)
    this.querySelector("select").classList.add(this.type)
    this.#setOptions()
  }

}

customElements.define("bm-select", BmSelect)