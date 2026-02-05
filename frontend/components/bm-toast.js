const globalStyle = document.createElement("style")

globalStyle.innerHTML = `
  bm-toast {
    position:fixed;
    display:block;
    width:50ch;
    bottom:5px;
    left:calc(50% - 25ch);
    border:none;
    padding:var(--pico-form-element-spacing-vertical) var(--pico-form-element-spacing-horizontal);
    border-radius:var(--pico-border-radius);
    font-size: 1rem;
    text-align: center;
    transform:translateY(5rem);
    transition:transform  0.3s;
    visibility:hidden;

    &.show {
      transform:translateY(0);
      transition:transform  0.3s;
      visibility:visible;
    }

    &[state=success] {
      background-color:#9DDBC4;
    }

    &[state=error] {
      background-color:#fbd5d2;
    }

    section {
      margin:0;
    }
  }
`

document.head.append(globalStyle)


const template =  document.createElement("template")

template.innerHTML = `
  <section>
    <output role="status">
    </output>
  </section>
`

class BmToast extends HTMLElement {

  static observedAttributes = ["label"]

  #delay = 5
  #timeoutId

  constructor() {
    super()
    this.append(template.content.cloneNode(true))
  }

  #update() {
    this.querySelector("output").textContent = this.getAttribute("label")
  }

  get delay() {
    return (this.getAttribute("delay") || this.#delay) * 1000
  }

  get label() {
    return this.getAttribute("label")
  }

  set label(value) {
    this.setAttribute("label", value)
  }

  get state() {
    return this.getAttribute("state")
  }

  set state(value) {
    this.setAttribute("state", value)
  }

  hide() {
    this.classList.remove("show")
  }

  show() {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId)
      this.hide();
    }
    this.classList.add("show")
    this.#timeoutId = setTimeout(() => this.hide(), this.delay)
  }

  connectedCallback() {
    this.#update();
    if (this.hasAttribute("show")) this.show();
  }

  attributeChangedCallback() {
    this.#update();
  }
}

customElements.define("bm-toast", BmToast)

export async function withToast(func) {
  const toast = document.querySelector("bm-toast")

  try {
    const msg = await func()
    toast.state = "success"
    toast.label = msg
  } catch (e) {
    toast.label = e.message
    toast.state = "error"
  } finally {
    toast.show()
  }
}