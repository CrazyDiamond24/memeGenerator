'use strict'

function onLoadGallery() {
  loadImgs()
}

function renderGallery() {
  const imgs = getImgs()
  imgs.forEach((img) => {
    let strHTML = `
        <div class="gallery-img">
        <img title="Click to Edit" src="${img.url}" onclick="onEditMeme(${img.id})"/>
        </div>
        `
    document.querySelector('.gallery-container').innerHTML += strHTML
  })
}


