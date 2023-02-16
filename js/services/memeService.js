'use strict'

let gId = 1
let gImgs = []
let gKeywords = { happy: 13, sad: 1 }

function loadImgs() {
    console.log('loaded')
  let images = loadFromStorage('gImgs')
  if (!images || images.length === 0) _createDefaultImgs()
  else gImgs = images
}

function _createDefaultImgs() {
  for (let i = 1; i <= 18; i++) {
    _createImg()
  }
  saveToStorage('gImgs', gImgs)
}

function _createImg() {
    console.log('created')
  var img = {
    id: gId,
    url: `/imgs/${gId++}.jpg`,
    keywords: [],
    currTxtIdx: 0,
    txts: [],
  }
  gImgs.push(img)
}

function getImgs(id) {
  if (!id) return gImgs
  let idx = getImgIdxById(id)
  return gImgs[idx]
}

function getImgIdxById(id) {
  return gImgs.findIndex((img) => img.id === id)
}


function addToMemeGallery(data) {
  let memes = loadFromStorage('memes')
  if (!memes || !memes.length) memes = [data]
  else memes.unshift(data)
  saveToStorage('memes', memes)
  renderMemeGallery()
}

function loadMemeGallery() {
  return loadFromStorage('memes')
}