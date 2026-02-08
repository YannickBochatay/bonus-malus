import "./bm-select.js"

const template = document.createElement('template')

template.innerHTML = `
  <table class="bonus-malus">
    <caption>
      <a href="user.html?user=xxx" title="voir les détails" class="user"></a>
    </caption>
    <thead>
      <tr>
        <th scope="col">Bonus</th>
        <th scope="col">Malus</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="bonus"></td>
        <td class="malus"></td>
      </tr>
      <tr>
        <td>
          <select user="" type="bonus" is="bm-select">
        </td>
        <td>
          <select user="" type="malus" is="bm-select">
        </td>
      </tr>
    </tbody>
  </table>
  <table class="bilan">
    <tr>
      <th>Total</th>
      <td>
        <a href="user.html?user=xxx" class="total"></a>
      </td>
    </tr>
    <tr>
      <th>Dépenses</th>
      <td>
        <a href="user.html?user=xxx#depenses" class="depenses"></a>
      </td>
    </tr>
    <tr>
      <th>Reste</th>
      <td>
        <strong class="reste"></strong>
      </td>
    </tr>
  </table>
`

class BmTable extends HTMLElement {

  static observedAttributes = ["bonus", "malus", "depenses", "user"]

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  get user() {
    return this.getAttribute("user")
  }

  get malus() {
    return this.getAttribute("malus")
  }

  get bonus() {
    return this.getAttribute("bonus")
  }

  get depenses() {
    return this.getAttribute("depenses")
  }

  async #update() {
    this.querySelector(".user").textContent = this.user
    this.querySelector(".total").textContent = (Number(this.bonus) + Number(this.malus))
    this.querySelector(".bonus").textContent = this.bonus
    this.querySelector(".malus").textContent = this.malus
    this.querySelector(".depenses").textContent = this.depenses
    this.querySelector(".reste").textContent = (Number(this.bonus) + Number(this.malus) - this.depenses)
  }

  #setUser() {
    this.querySelector(".user").textContent = this.user
        
    for (const node of this.querySelectorAll("a")) {
      node.href = node.href.replace(/user=\w+/, "user=" + this.user)
    }

    for (const node of this.querySelectorAll("[user]")) {
      node.setAttribute("user", this.user)
    }
  }

  connectedCallback() {
    this.#setUser()
    this.#update()
  }

  attributeChangedCallback() {
    this.#update()
  }
}

customElements.define("bm-table", BmTable)