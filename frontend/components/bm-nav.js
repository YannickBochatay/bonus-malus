import { ROOT_URL } from "../utils.js"

const style = document.createElement("style")

style.innerHTML = /*css*/`
  h1 {
    display:inline;
    font-size:var(--pico-font-size);
    color:inherit;
  }
  #logo {
    display:flex;
    align-items: center;
    padding:0;
  }
  #logo a {
    margin:0;
  }
  #logo img {
    height:100px;
    margin-right:20px;
  }
  nav details {

      position:absolute;
      top:1.5rem;
      right:1.5rem;
      display:flex;
      flex-direction:column;
      align-items: end;
      z-index:1;

      ul {
        display:block;
        border: var(--pico-border-width) solid var(--pico-table-border-color);
        background-color: var(--pico-background-color);
        border-radius:var(--pico-border-radius);

        li {
          display:block;
          margin:0;
          padding:0;
          a {
            display:block;
            margin:0;
            padding:var(--pico-spacing) calc(var(--pico-spacing) * 2);
          }
          a:hover {
            background-color:var(--pico-dropdown-hover-background-color);
            text-decoration:none;
          }
        }
      }

      summary {
        font-size:2rem;
        transform:rotate(0deg);
        transition:transform 0.5s;
        &::after {
          content:none;
        }
      }

      &[open] summary {
        transform:rotate(360deg);
        transition:transform 0.5s;
      }
    }
`

document.head.append(style)


const template = document.createElement("template")

template.innerHTML = `
  <nav>
    <ul>
      <li id="logo">
        <a href="${ROOT_URL}/">
          <img src="${ROOT_URL}/assets/trophy.svg" alt="logo trophée">
        </a>
        <h1>Bonus/Malus</h1>
      </li>
    </ul>
    <details>
      <summary aria-label="settings">☰</summary>
      <ul>
        <li>
          <a href="${ROOT_URL}/">Accueil</a>
        </li>
        <li>
          <a href="${ROOT_URL}/pages/users">Joueur·ses</a>
        </li>
        <li>
          <a href="${ROOT_URL}/pages/bareme">Barème</a>
        </li>
        <li>
          <a href="${ROOT_URL}/pages/doc">Documentation</a>
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