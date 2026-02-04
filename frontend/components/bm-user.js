import { user } from "../state/utils.js"

const template = document.createElement("template");

template.innerHTML = `
  <h2>${user}</h2>
  <div role="group" id="tabs">
    <a href="#actions" role="button" class="secondary outline">Actions</a>
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
}

customElements.define("bm-user", BmUser)