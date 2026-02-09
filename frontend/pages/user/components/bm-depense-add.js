import { addDepense } from "../state.js"
import { withToast } from "../../../components/bm-toast.js"

const template = document.createElement("template")

template.innerHTML = `
  <h4>Ajouter une dépense</h4>
  <form>
    <input
      type="text"
      name="descript"
      placeholder="Objet de la dépense"
      aria-label="Objet de la dépense"
      required
    >
    <fieldset role="group">
      <input
        type="number"
        name="cost"
        placeholder="Coût en euros"
        min="0"
        step="0.01"
        aria-label="coût en euros"
        required
      >
      <input type="submit" value="Valider">
    </fieldset>
  </form>
`

class BmDepenseAdd extends HTMLElement {

  #form

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
    this.#form = this.querySelector("form")
  }

  #handleSubmit = e => {
    e.preventDefault();
    const data = new FormData(this.#form)
    withToast(() => addDepense(data))
    this.#form.reset()
    this.querySelector("input[name=descript]").focus()
  }

  connectedCallback() {
    this.#form.addEventListener("submit", this.#handleSubmit)
  }
}

customElements.define("bm-depense-add", BmDepenseAdd)