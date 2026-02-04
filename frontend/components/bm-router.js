let template = document.createElement("template");

template.innerHTML = `
<style>
  bm-router {
    display:block;
  }
  bm-router > * {
    display:none;
  }
  body:not(:has(:target)) bm-router > *:first-child,
  bm-router > *:target,
  bm-router > *:has(:target),
  bm-router > *:target bm-router > *:first-child {
    display:block;
  }
</style>
<slot></slot>
`

class BmRouter extends HTMLElement {

  constructor() {
    super();
    this.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("bm-router", BmRouter);