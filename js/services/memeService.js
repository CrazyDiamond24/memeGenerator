'use strict'
//GLOBALS
//-------------------------------------------------
let gId = 1
let gImgs = []

//IMAGE
//-------------------------------------------------
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
    url: `imgs/${gId++}.jpg`,
    keywords: [], //getKeywordsById(gId)
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

//CANVAS
//-------------------------------------------------
function getCoords(ev) {
  console.log(ev)
  console.log('x:', ev.offsetX)
  console.log('y:', ev.offsetY)
}

function createNewTxt(fillColor, strokeColor) {
  const { txt: text = '', fontSize, font } = getTxtInfo()
  const newTxt = {
    txtIdx: gCurrMeme.currTxtIdx++,
    text: text,
    x: gCurrSelections.x,
    y: gCurrSelections.y,
    stroke: strokeColor,
    fill: fillColor,
    align: gCurrSelections.align,
    font: font,
    fontSize: fontSize,
  }
  gCurrMeme.txts.push(newTxt)
  gCurrTxtIdx++
  return newTxt
}

function updateCanvas(currText) {
  gCtx.lineWidth = '2'
  gCtx.strokeStyle = currText.stroke
  gCtx.fillStyle = currText.fill
  gCtx.font = `${currText.fontSize}px ${currText.font}`
  gCtx.textAlign = currText.align
  drawText(
    currText.x,
    currText.y,
    currText.fontSize,
    currText.fill,
    currText.text,
    currText.font
  )
}

//TEXT
//-------------------------------------------------
function updateY() {
  switch (gCurrTxtIdx) {
    case 0:
      gCurrSelections.y = (gCurrTxtIdx + 1) * 40
      break
    case 1:
      gCurrSelections.y = (gCurrTxtIdx + 1) * 230
      break
    case 2:
      gCurrSelections.y = (gCurrTxtIdx + 1) * 80
      break
  }
}

function updateTxt(currText, txt, fillColor, strokeColor) {
  currText.text = txt
  currText.fill = fillColor
  currText.stroke = strokeColor
  currText.fontSize = gCurrSelections.fontSize
  currText.font = gCurrSelections.font
}

function getTextDimensions(text, fontSize, font) {
  gCtx.font = fontSize + 'px ' + font
  const width = gCtx.measureText(text).width
  const height = fontSize + 7
  return { width, height }
}
function getTxtInfo() {
  const txt = document.querySelector('.meme-text').value
  const font = document.querySelector('.change-font').value
  const fontSize = parseInt(document.querySelector('.font-size').innerText)
  return { txt, fontSize, font }
}
