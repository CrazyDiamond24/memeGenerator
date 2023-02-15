'use strict'
const gCanvas = document.querySelector('canvas')
const gCtx = gCanvas.getContext('2d')
let gCurrMeme = {}
let gCurrSelections = {}

function drawImgOnCanvas(image) {
  let img = new Image()
  img.onload = () => {
    resizeCanvas(img.width, img.height)
    gCtx.drawImage(img, 0, 0, img.width, img.height)
    gCurrSelections.x = img.width / 2
  }
  img.src = image.url
}

function renderMeme(meme) {
  drawImgOnCanvas(meme.url)
  meme.txts.forEach((txt) => {
    gCurrSelections = {
      x: txt.x,
      y: txt.y,
      font: txt.font,
      fontSize: txt.fontSize,
      stroke: txt.stroke,
      align: txt.align,
      text: txt.text,
      fill: 'black',
    }
    onAddTxt(true)
  })
}

function resizeCanvas(width, height) {
  gCanvas.width = width
  gCanvas.height = height
}

function onEditMeme(id) {
  const img = getImgs(id)
  drawImgOnCanvas(img)
  gCurrMeme = img
  onDisplayPage('.editor-page')
}

function getCoords(ev) {
  console.log(ev)
  console.log('x:', ev.offsetX)
  console.log('y:', ev.offsetY)
}

function onWriteTxt(el) {
  gCurrSelections.text = el.value
  console.log(el.value)
  onAddTxt()
}

function onAddTxt(isReRender = false) {
  let txt
  if (!isReRender) {
    if (gCurrMeme.currTxtIdx === 1)
      gCurrSelections.y = gCanvas.height - gCurrSelections.fontSize + 50
    else if (gCurrMeme.currTxtIdx > 1) gCurrSelections.y = gCanvas.height / 2
    const { txt: text, fontSize, font } = getTxtInfo()
    txt = text
    gCurrMeme.txts.push({
      txtIdx: gCurrMeme.currTxtIdx++,
      text: txt,
      x: gCurrSelections.x,
      y: gCurrSelections.y,
      stroke: gCurrSelections.stroke,
      fill: gCurrSelections.fill,
      align: gCurrSelections.align,
      font: font,
      fontSize: fontSize,
    })
  } else {
    txt = gCurrSelections.text
  }
  const { fontSize, font } = getTxtInfo()
  gCtx.lineWidth = '2'
  gCtx.strokeStyle = gCurrSelections.stroke
  gCtx.fillStyle = gCurrSelections.fill
  gCtx.font = `${fontSize}px ${font}`
  gCtx.textAlign = gCurrSelections.align
  drawText(
    gCurrSelections.x,
    gCurrSelections.y,
    fontSize,
    gCurrSelections.fill,
    txt,
    font
  )
  document.querySelector('.meme-text').value = ''
}

//move later

function getTxtInfo() {
  const txt = document.querySelector('.meme-text').value
  const font = document.querySelector('.change-font').value
  const fontSize = parseInt(
    document.querySelector('.font-size').innerText.slice(11)
  )
  return { txt, fontSize, font }
}

function drawText(x, y, size, color, txt, font) {
  gCtx.lineWidth = 1
  gCtx.strokeStyle = 'brown'
  gCtx.fillStyle = color
  gCtx.font = `${size}px ${font}`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  gCtx.fillText(txt, x, y) // Draws (fills) a given text at the given (x, y) position.
  gCtx.strokeText(txt, x, y) // Draws (strokes) a given text at the given (x, y) position.
}
