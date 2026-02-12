let template = document.createElement("template");

template.innerHTML = /*css*/`
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
    scroll-margin-top: 1000px;
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