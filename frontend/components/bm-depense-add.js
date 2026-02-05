import { addDepense } from "../state/user-state.js"
import { withToast } from "./bm-toast.js"

const template = document.createElement("template")

template.innerHTML = `
  <h4>Ajouter une dépense</h4>
  <form>
    <input
      type="text"
      name="descript"
      placeholder="Objet de la dépense"
      aria-label="Objet de la dépense"
    >
    <fieldset role="group">
      <input
        type="number"
        name="cost"
        placeholder="Coût en euros"
        min="0"
        step="0.01"
        aria-label="coût en euros"
      >
      <input type="submit" value="Valider">
    </fieldset>
  </form>
`

class BmDepenseAdd extends HTMLElement {
  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(this.querySelector("form"))
    withToast(addDepense(data));
  }

  connectedCallback() {
    this.querySelector("form").addEventListener("submit", this.#handleSubmit)
  }
}

customElements.define("bm-depense-add", BmDepenseAdd)