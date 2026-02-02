import { getUsersSummary } from "../state.js"

class BmApp extends HTMLElement {

  async connectedCallback() {
    const users = await getUsersSummary()
    this.innerHTML = users.map(user => `
      <bm-table
        user=${user.joueur} 
        bonus=${user.bonus} 
        malus=${user.malus} 
        depenses=${user.depenses}
      ></bm-tables>
    `).join("")
  } 
}

customElements.define("bm-app", BmApp)