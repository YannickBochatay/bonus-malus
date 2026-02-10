import { state, onStateChange, offStateChange, getBaremeActions, addUserAction } from "../state.js";
import { withToast } from "../../../components/bm-toast.js";

getBaremeActions()

const style = document.createElement("style")

style.innerHTML = /*css*/`
  select[is=bm-select], select[is=bm-select]:invalid {
    color:white;
    text-align:center;
    padding-left:45px;
    margin-bottom:0;

    &.bonus {
      background-color:#04AA6D;
    }
    &.malus {
      background-color:#f44336;
    }
  }
`

document.head.append(style)

const template = document.createElement('template')

template.innerHTML = `
  <option value="" disabled selected hidden>Ajouter</option>
`

class BmSelect extends HTMLSelectElement {

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #setOptions = () => {
    const actions = state.bareme.filter(action => {
      return action.valeur > 0 && this.type === "bonus" || action.valeur < 0 && this.type === "malus"
    })

    for (const [index, action] of actions.entries()) {
      const option = this.children[index + 1] ?? document.createElement("option")
      option.value = action.id
      option.textContent = `${action.action} (${action.valeur>0?"+":""}${action.valeur})`
      if (!option.parentNode) this.append(option)
    }

    while (this.children.length > actions.length + 1) this.lastElementChild.remove()
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
    data.append("action", this.value)

    withToast(() => addUserAction(this.user, data))
    this.value = ""
  }

  connectedCallback() {
    this.addEventListener("change", this.#handleSubmit)
    this.classList.add(this.type)
    this.setAttribute("aria-label", "sélection d'un " + this.type)
    onStateChange("bareme", this.#setOptions)
    this.#setOptions()
  }

  disconnectedCallback() {
    offStateChange("bareme", this.#setOptions)
  }
}

customElements.define("bm-select", BmSelect, { extends : "select" })