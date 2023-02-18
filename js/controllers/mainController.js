'use strict'
//GLOBALS
//-------------------------------------------------
let gSections = ['.gallery-page', '.editor-page', '.saved-memes' , '.about-page']
let gCurrPage = '.gallery-page'

//INIT AND DISPLAY SECTION
//-------------------------------------------------
function onInit() {
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
