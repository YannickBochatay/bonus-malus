import { state, onStateChange, offStateChange, getActions, addUserAction } from "../state.js";

getActions()

const template = document.createElement('template')

template.innerHTML = `
  <select>
    <option value="" disabled selected hidden>Ajouter</option>
  </select>
`

class BmSelect extends HTMLElement {

  #select

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
    this.#select = this.querySelector("select")
  }

  #setOptions = () => {
    const actions = state.bareme.filter(action => {
      return action.valeur > 0 && this.type === "bonus" || action.valeur < 0 && this.type === "malus"
    })

    for (const [index, action] of actions.entries()) {
      const option = this.#select.children[index + 1] ?? document.createElement("option")
      option.value = action.id
      option.textContent = `${action.action} (${action.valeur>0?"+":""}${action.valeur})`
      if (!option.parentNode) this.#select.append(option)
    }

    while (this.#select.children.length > actions.length) this.#select.lastElementChild.remove()
  }

  get user() {
    return this.getAttribute('user')
  }

  get type() {
    return this.getAttribute("type")
  }

  #handleSubmit = async () => {
    let data = new FormData()
    data.append("joueur", this.user)
    data.append("action", this.querySelector("select").value)

    try {
      await addUserAction(this.user, data)
    } catch (e) {
      console.error(e)
    }
  }

  connectedCallback() {
    this.#select.addEventListener("change", this.#handleSubmit)
    this.#select.classList.add(this.type)
    onStateChange("bareme", this.#setOptions)
    this.#setOptions()
  }

  disconnectedCallback() {
    offStateChange("bareme", this.#setOptions)
  }
}

customElements.define("bm-select", BmSelect)