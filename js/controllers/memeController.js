'use strict'
const gCanvas = document.querySelector('canvas')
const gCtx = gCanvas.getContext('2d')
let gCurrMeme = {}
let gCurrSelections = {}
let gCurrTxtIdx = 0

let gElmodal = document.querySelector('.save-share-modal')

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
      fill: txt.color,
    }
    onAddTxt(true)
  })
}

function resizeCanvas(width, height) {
  gCanvas.width = width
  gCanvas.height = height
}


function getCoords(ev) {
  console.log(ev)
  console.log('x:', ev.offsetX)
  console.log('y:', ev.offsetY)
}

function onWriteTxt(el) {
  gCurrSelections.text = el.value
  console.log(el.value)
  onAddTxt(gCurrSelections.fill, gCurrSelections.stroke)
}

function onAddTxt(fillColor, strokeColor, isReRender = false) {
    let txt
    gCurrSelections.y = (gCurrTxtIdx + 1) * 50
    // console.log(isReRender)
    if (!isReRender) {
    //   console.log(isReRender)
      if (gCurrMeme.currTxtIdx > 0) gCurrTxtIdx++
      const { txt: text, fontSize, font } = getTxtInfo()
      txt = text
      gCurrMeme.txts.push({
        txtIdx: gCurrMeme.currTxtIdx++,
        text: txt,
        x: gCurrSelections.x,
        y: gCurrSelections.y,
        stroke: strokeColor,
        fill: fillColor,
        align: gCurrSelections.align,
        font: font,
        fontSize: fontSize,
      })
    } else {
      txt = gCurrSelections.text
    }
    gCurrSelections.fill = fillColor
    gCurrSelections.stroke = strokeColor
    gCurrSelections.fontSize = parseInt(document.querySelector('.font-size span').innerText)
    gCurrSelections.font = document.querySelector('.change-font').value
    gCtx.lineWidth = '2'
    gCtx.strokeStyle = gCurrSelections.stroke
    gCtx.fillStyle = gCurrSelections.fill
    gCtx.font = `${gCurrSelections.fontSize}px ${gCurrSelections.font}`
    gCtx.textAlign = gCurrSelections.align
    drawText(gCurrSelections.x, gCurrSelections.y, gCurrSelections.fontSize, gCurrSelections.fill, txt, gCurrSelections.font)
    document.querySelector('.meme-text').value = ''
  }
  
  

//move later

function getTxtInfo() {
  const txt = document.querySelector('.meme-text').value
  const font = document.querySelector('.change-font').value
  const fontSize = parseInt(document.querySelector('.font-size').innerText)
  return { txt, fontSize, font }
}

function drawText(x, y, size, color, txt, font) {
  gCtx.lineWidth = 1
  gCtx.fillStyle = color
  gCtx.font = `${size}px ${font}`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  gCtx.fillText(txt, x, y)
  gCtx.strokeText(txt, x, y)
}

function onChangeFill(el) {
  gCurrSelections.fill = el.value
  onAddTxt(el.value, gCurrSelections.stroke, true)
}

function onChangeBorder(el) {
  gCurrSelections.stroke = el.value
  onAddTxt(gCurrSelections.fill, el.value, true)
}

function onChangeFontSize(diff) {
    const fontSizeEl = document.querySelector('.font-size span')
    let fontSize = parseInt(fontSizeEl.innerText) + diff
    if (fontSize < 10) fontSize = 10
    fontSizeEl.innerText = fontSize
  
    // Only change the font size of the current text selection without redrawing it
    gCurrSelections.fontSize = fontSize
    drawText(gCurrSelections.x, gCurrSelections.y, fontSize, gCurrSelections.fill, gCurrSelections.text, gCurrSelections.font)
  }
  

function resetSelections() {
  gCurrSelections = {
    x: 0,
    y: 0,
    font: 'Impact',
    fontSize: 40,
    stroke: '#000000',
    align: 'center',
    text: '',
    fill: '#ffffff',
  }
  gCurrTxtIdx = 0
}

function onChangeCurrTxt() {
  if (!gCurrMeme.txts.length) {
    console.log('bye')
    return
  } else if (gCurrMeme.currTxtIdx >= gCurrMeme.txts.length)
    gCurrMeme.currTxtIdx = 0
  else gCurrMeme.currTxtIdx++
  markCurrTxt()
}

function markCurrTxt() {
    let idx = gCurrMeme.currTxtIdx
    if (idx >= gCurrMeme.txts.length) return
    let text = gCurrMeme.txts[idx]
    gCtx.font = text.fontSize + 'px' + text.font
    let textLength = gCtx.measureText(text.text)
    let x
    switch (text.align) {
      case 'center':
        x = text.x - textLength / 2
        break
      case 'left':
        x = text.x
        break
      case 'right':
        x = text.x - textLength
        break
    }
    let y = text.y - text.fontSize
    console.log(x, y, textLength.width)
  }
  
function onEditMeme(id) {
  const img = getImgs(id)
  resetSelections()
  drawImgOnCanvas(img)
  gCurrMeme = img
  onDisplayPage('.editor-page')
}


function onAlignTxt(align, el) {
    console.log(align)
    // update the alignment property of the gCurrSelections object
    gCurrSelections.align = align
  
    // update the active button state
    document.querySelectorAll('.align-btns button').forEach(btn => {
      btn.classList.remove('active')
    })
    el.classList.add('active')
  
    // redraw the text with the new alignment
    gCtx.textAlign = gCurrSelections.align
    gCurrMeme.txts.forEach((txt) => {
      if (txt.text === gCurrSelections.text) {
        drawText(txt.x, txt.y, txt.fontSize, txt.fill, txt.text, txt.font)
      }
    })
  }
  

  function onDisplayModal() {
    event.stopPropagation()
    console.log('modal')
    document.querySelector('.save-share-modal').style.display = 'flex'
  }
  
  function onCloseModal() {
    console.log('closed')
    const modal = document.querySelector('.save-share-modal');
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  }
  