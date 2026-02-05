const template = document.createElement("template")

template.innerHTML = `
  <nav>
    <ul>
      <li id="logo">
        <a href="./">
          <img src="assets/trophy.svg" alt="logo trophée">
          <h1>Bonus/Malus</h1>
        </a>
      </li>
    </ul>
    <ul>
      <li><a href="bareme.html">Barème</a></li>
    </ul>
  </nav>
`

class BmNav extends HTMLElement {
  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }  
}

customElements.define("bm-nav", BmNav)