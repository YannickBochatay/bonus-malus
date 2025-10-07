document.querySelectorAll("select").forEach(node => {
  node.addEventListener("change", () => node.form.submit())
})