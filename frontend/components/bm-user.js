import "./bm-actions.js"
import "./bm-depenses.js"
import "./bm-router.js"
import { user } from "../state/utils.js"

const template = document.createElement("template");

template.innerHTML = `
  <h2>${user}</h2>
  <div role="group" id="tabs">
    <a href="#actions" role="button" class="secondary">Actions</a>
    <a href="#depenses" role="button" class="secondary outline">Dépenses</a>
  </div>
  <bm-router>
    <bm-actions id="actions" user="${user}"></bm-actions>
    <bm-depenses id="depenses" user="${user}"></bm-depenses>
  </bm-router>
`

class BmUser extends HTMLElement {

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #handleHashChange = () => {
    const hash = location.hash && location.hash !== "#" ? location.hash :"actions"
    
    scrollTo({ top : 0 })
    this.querySelectorAll("a").forEach(node => {
      if (node.href.includes(hash)) node.classList.remove("outline")
      else node.classList.add("outline")
    })
  }

  connectedCallback() {
    addEventListener("hashchange", this.#handleHashChange)
    this.#handleHashChange()
  }

  disconnectedCallback() {
    removeEventListener("hashchange", this.#handleHashChange)
  }
}

customElements.define("bm-user", BmUser)