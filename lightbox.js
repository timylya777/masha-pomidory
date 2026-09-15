// Lightbox: any <img data-lb> opens fullscreen. Group = same data-lb-group.
(() => {
  let list = []
  let index = 0
  let previousOverflow = ""
  const lightbox = document.createElement("div")
  lightbox.id = "lb"
  lightbox.setAttribute("role", "dialog")
  lightbox.setAttribute("aria-modal", "true")
  lightbox.setAttribute("aria-label", "Просмотр изображения")
  lightbox.innerHTML = '<button class="x" type="button" aria-label="Закрыть">✕</button><button class="n prev" type="button" aria-label="Предыдущее изображение">‹</button><img alt=""><button class="n next" type="button" aria-label="Следующее изображение">›</button><div class="cap"></div>'
  document.body.appendChild(lightbox)

  const image = lightbox.querySelector("img")
  const caption = lightbox.querySelector(".cap")
  const closeButton = lightbox.querySelector(".x")
  const previousButton = lightbox.querySelector(".prev")
  const nextButton = lightbox.querySelector(".next")

  function show() {
    const item = list[index]
    image.src = item.src
    image.alt = item.alt
    caption.textContent = item.caption || item.alt
    previousButton.hidden = list.length < 2
    nextButton.hidden = list.length < 2
  }

  function open(clickedImage) {
    const group = clickedImage.getAttribute("data-lb-group")
    const images = [...document.querySelectorAll("img[data-lb]")].filter((item) => !group || item.getAttribute("data-lb-group") === group)
    list = images.map((item) => ({
      src: item.currentSrc || item.src,
      alt: item.alt || "",
      caption: item.getAttribute("data-lb-cap") || "",
    }))
    index = Math.max(0, images.indexOf(clickedImage))
    show()
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    lightbox.classList.add("open")
    closeButton.focus()
  }

  function close() {
    lightbox.classList.remove("open")
    document.body.style.overflow = previousOverflow
    image.removeAttribute("src")
  }

  function step(amount) {
    index = (index + amount + list.length) % list.length
    show()
  }

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null
    const clickedImage = target?.closest("img[data-lb]")
    if (clickedImage) {
      open(clickedImage)
      return
    }
    if (target === lightbox || target?.closest("#lb .x")) close()
    if (target?.closest("#lb .prev") && list.length > 1) step(-1)
    if (target?.closest("#lb .next") && list.length > 1) step(1)
  })

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return
    if (event.key === "Escape") close()
    if (event.key === "ArrowLeft" && list.length > 1) step(-1)
    if (event.key === "ArrowRight" && list.length > 1) step(1)
  })
})()
