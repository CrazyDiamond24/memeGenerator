'use strict'

function onLoadGallery() {
  loadImgs()
}

function renderGallery() {
  const imgs = getImgs()
  imgs.forEach((img) => {
    let strHTML = `
        <div class="gallery-img">
        <img src="${img.url}" onclick="onEditMeme(${img.id})"/>
        </div>
        `
    document.querySelector('.gallery-container').innerHTML += strHTML
  })
}

//the meme gallery
function renderMemeGallery() {
  const memes = loadMemeGallery()
  if (!memes || !memes.length) {
    document.querySelector('.memes').innerHTML = ''
    document.querySelector('.no-memes-msg').style.display = 'block'
    return
  } else {
    document.querySelector('.no-memes-msg').style.display = 'none'
  }
  document.querySelector('.memes').innerHTML = ''
  memes.forEach((meme) => {
    let strHTML = `
        <div class="gallery-image"> 
        <img src="${meme.imgData}"/ onclick="drawImgOnCanvas()">
        </div>
        `
    document.querySelector('.memes').innerHTML += strHTML
  })
}
