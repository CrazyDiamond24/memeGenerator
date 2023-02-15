'use strict'
let gSections = ['.gallery-page', '.editor-page', '.saved-memes']
let gCurrPage = '.gallery-page'

function onInit() {
  console.log('connected')
  //reset stuff
  onLoadGallery()
  renderGallery()
  renderMemeGallery()
  onDisplayPage(gCurrPage)
}

function onDisplayPage(page) {
  gSections.forEach((section) => {
    document.querySelector(section).style.display =
      section === page ? 'flex' : 'none'
  })
}
