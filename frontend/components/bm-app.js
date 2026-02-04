import { state, onStateChange, getUsersSummary } from "../state/home-state.js"

getUsersSummary()

class BmApp extends HTMLElement {

  #update = () => {
    this.innerHTML = state.users.map(user => `
      <bm-table
        user=${user.joueur} 
        bonus=${user.bonus} 
        malus=${user.malus} 
        depenses=${user.depenses}
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