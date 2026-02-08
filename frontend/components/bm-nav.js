const template = document.createElement("template")

template.innerHTML = `
  <nav>
    <ul>
      <li id="logo">
        <a href="./">
          <img src="assets/trophy.svg" alt="logo trophée">
        </a>
        <h1>Bonus/Malus</h1>
      </li>
    </ul>
    <details>
      <summary aria-label="settings">☰</summary>
      <ul>
        <li>
          <a href="./">Accueil</a>
        </li>
        <li>
          <a href="users.html">Joueur·ses</a>
        </li>
        <li>
          <a href="bareme.html">Barème</a>
        </li>
        <li>
          <a href="doc.html">Documentation</a>
        </li>
      </ul>
    </details>
  </nav>
`

class BmNav extends HTMLElement {
  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }
  
  connectedCallback() {
    const details = this.querySelector("details")
    const summary = this.querySelector("summary")
    summary.addEventListener("click", () => {
      summary.textContent = details.open ? "☰" : "X"
    })
  }
}

customElements.define("bm-nav", BmNav)