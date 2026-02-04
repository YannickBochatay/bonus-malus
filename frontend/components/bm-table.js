const template = document.createElement('template')

template.innerHTML = `
  <table>
    <caption>
      <a href="<user>/details#actions" title="voir les détails" class="user" class="user"></a>
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
          <bm-select user="" type="bonus">
        </td>
        <td>
          <bm-select user="" type="malus">
        </td>
      </tr>
    </tbody>
  </table>
  <table>
    <tr>
      <th>Total</th>
      <td>
        <a href="<user>/details#actions" class="total"></a>
      </td>
    </tr>
    <tr>
      <th>Dépenses</th>
      <td>
        <a href="<user>/details#depenses" class="depenses"></a>
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
    this.querySelector(".total").textContent = this.bonus - this.malus
    this.querySelector(".bonus").textContent = this.bonus
    this.querySelector(".malus").textContent = this.malus
    this.querySelector(".depenses").textContent = this.depenses
    this.querySelector(".reste").textContent = this.bonus - this.malus - this.depenses
  }

  #setUser() {
    this.querySelector(".user").textContent = this.user
        
    for (const node of this.querySelectorAll("a")) {
      node.href = node.href.replace("<user>", this.user)
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