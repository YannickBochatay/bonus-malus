import { state, addUserAction, getBaremeActions } from "../state.js"
import { withToast } from "../../../components/bm-toast.js"

const template = document.createElement("template")

template.innerHTML = `
  <h4>Ajouter une action</h4>
  <form>
    <fieldset role="group">
      <select
        name="action"
        placeholder="sélectionner une action"
        aria-label="choix d'une action"
        required
      >
        <option value="" disabled selected hidden>Sélectionner</option>
      </select>
      <input type="submit" value="Valider">
    </fieldset>
  </form>
`

class BmActionAdd extends HTMLElement {

  #form

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
    this.#form = this.querySelector("form")
  }

  #setOptions = () => {
    const select = this.querySelector("select")
    for (const action of state.bareme) {
      const option = document.createElement("option")
      option.value = action.id
      option.textContent = `${action.action} (${action.valeur>0?"+":""}${action.valeur})`
      select.append(option)
    }
  }

  #handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(this.#form)
    withToast(() => addUserAction(data))
    this.#form.reset()
  }

  connectedCallback() {
    this.#form.addEventListener("submit", this.#handleSubmit)
    getBaremeActions().then(this.#setOptions)
  }
}

customElements.define("bm-action-add", BmActionAdd)