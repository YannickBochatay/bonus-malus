import "./bm-table.js"
import { state, onStateChange, getUsersSummary } from "../state/main-state.js"

getUsersSummary()

class BmApp extends HTMLElement {

  #update = () => {
    this.innerHTML = state.users.map(user => `
      <bm-table
        user=${user.joueur} 
        bonus=${user.bonus ?? 0} 
        malus=${user.malus ?? 0} 
        depenses=${user.depenses ?? 0}
      ></bm-table>
    `).join("")
  }

  connectedCallback() {
    onStateChange("users", this.#update)
  }

  disconnectedCallback() {
    offStateChange("users", this.#update)
  }
}

customElements.define("bm-app", BmApp)