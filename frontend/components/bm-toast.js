const template =  document.createElement("template")

template.innerHTML = `
  <style>
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

    &.show {
      transform:translateY(0);
      transition:transform  0.3s;
    }

    &[state=success] {
      color:#083e08;
      background-color:#b0fdb0;
    }

    &[state=error] {
      color:#6e0303;
      background-color:#fdb0b0;
    }

    section {
      margin:0;
    }
  }
  </style>
  <section>
    <output role="status">
    </output>
  </section>
`

class BmToast extends HTMLElement {

  static observedAttributes = ["label"]

  #delay = 3
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

  hide = () => {
    clearTimeout(this.#timeoutId)
    this.#timeoutId = null
    this.classList.remove("show")
  }

  show = () => {
    if (this.classList.contains("show")) {
      this.hide()
      return setTimeout(this.show, 300)
    }

    this.classList.add("show")
    this.#timeoutId = setTimeout(this.hide, this.delay)
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