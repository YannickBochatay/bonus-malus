import "./bm-user-edit.js"
import "./bm-user-add.js"
import { state, onStateChange, getUsersSummary } from "../state.js"

const template = document.createElement("template")

template.innerHTML = `
  <fieldset>
    <legend>Joueurs et joueuses inscrit·es</legend>
    <div></div>
  </fieldset>
  <bm-user-add></bm-user-add>
`

getUsersSummary()

class BmUsers extends HTMLElement {

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #update = () => {
    this.querySelector("fieldset div").innerHTML = state.users.map(user => {
      let deletable = (user.bonus || user.malus) ? "" : "deletable"
      return `<bm-user-edit user="${user.joueur}" ${deletable}></bm-user-edit>`
    }).join("")
  }

  connectedCallback() {
    onStateChange("users", this.#update)
  }

  disconnectedCallback() {
    offStateChange("users", this.#update)
  }
}

customElements.define("bm-users", BmUsers)