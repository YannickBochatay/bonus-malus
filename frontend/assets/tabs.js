const tabs = document.getElementById("tabs")
const buttons = [...tabs.children]
const contents = buttons.map(button => {
  const id = button.dataset.for
  return document.querySelector(`div[data-id=${id}]`)
})

function showContent(id) {
  buttons.forEach(button => {
    const buttonId = button.dataset.for
    const method = (id === buttonId) ? "remove" : "add"
    button.classList[method]("outline")
  })
  contents.forEach(content => {
    content.style.display = (content.dataset.id === id) ? "block" : "none"
  })
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const id = button.dataset.for
    showContent(id)
    window.location.hash = "#" + id
  })
})

function handleHashChange() {
  const contentId = window.location.hash.replace("#", "") || "actions"
  showContent(contentId)
}


window.addEventListener("hashchange", handleHashChange)

handleHashChange()