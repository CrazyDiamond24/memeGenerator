'use strict'
//Globals
//-------------------------------------------------
const gCanvas = document.querySelector('canvas')
const gCtx = gCanvas.getContext('2d')
let gCurrMeme = {}
let gCurrSelections = {}
let gCurrTxtIdx = 0
let gisReRender = false
let gCurrMemeImage
let gFirstTxt = true
let gTxtAlign = 'center'

let gElmodal = document.querySelector('.save-share-modal')

//IMAGE AND CANVAS
//-------------------------------------------------
function drawImgOnCanvas(image) {
  let img = new Image()
  img.onload = () => {
    resizeCanvas(img.width, img.height)
    gCtx.drawImage(img, 0, 0, img.width, img.height)
    gCurrSelections.x = img.width / 2
  }
  img.src = image.url
  gCurrMemeImage = image
}

function renderMeme(meme) {
  drawImgOnCanvas(meme)
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
    gisReRender = true
    onAddTxt(gisReRender)
    gisReRender = false
  })
}

function resizeCanvas(width, height) {
  gCanvas.width = width
  gCanvas.height = height
}

function onEditMeme(id) {
  const img = getImgs(id)
  resetSelections()
  drawImgOnCanvas(img)
  gCurrMeme = img
  onDisplayPage('.editor-page')
}

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
        <img class="gallery-image" src="${meme.imgData}"/ onclick="drawImgOnCanvas()">
        </div>
        `
    document.querySelector('.memes').innerHTML += strHTML
  })
}

//TEXT & EDITING
//-------------------------------------------------
function onWriteTxt(el) {
  gCurrSelections.text = el.value
  gisReRender = false
  onAddTxt(gCurrSelections.fill, gCurrSelections.stroke, gisReRender)
  gisReRender = true

  onMarkCurrTxt()
}

function onSelectEmoji(emoji) {
  const inputEl = document.querySelector('.meme-text')
  inputEl.value = emoji
  onWriteTxt(inputEl)
  inputEl.value = ''
}

function onAddTxt(fillColor, strokeColor, isReRender) {
  let txt
  if (gCurrMeme.txts.length >= 3 && isReRender == false) {
    displayFlashMessage('You can only add up to 3 texts!')
    return
  }
  // if adding a new text
  if (!isReRender) {
    updateY()
  }

  // If user is trying to update an existing text, find the corresponding text object
  let currText = gCurrMeme.txts[gCurrTxtIdx - 1]

  // If not updating an existing text, create a new text object
  if (!isReRender) {
    currText = createNewTxt(fillColor, strokeColor)
    txt = currText.text
  } else {
    txt = currText.text
  }
  if (currText.text === '') {
    gCurrMeme.txts.pop()
    gCurrTxtIdx--
    return
  }
  updateTxt(currText, txt, fillColor, strokeColor)
  updateCanvas(currText)
  document.querySelector('.meme-text').value = ''
}

function drawText(x, y, size, color, txt, font) {
  gCtx.lineWidth = 1
  gCtx.fillStyle = color
  gCtx.font = `${size}px ${font}`
  gCtx.textAlign = gTxtAlign
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
  gCurrSelections.fontSize = fontSize
  // reseting canvas to its original form
  let img = new Image()
  img.onload = () => {
    resizeCanvas(img.width, img.height)
    gCtx.drawImage(img, 0, 0, img.width, img.height)
    gCurrSelections.x = img.width / 2
    //drawing all text except the text we are changing
    for (let i = 0; i < gCurrMeme.txts.length; i++) {
      const txt = gCurrMeme.txts[i]
      if (txt.txtIdx + 1 === gCurrTxtIdx) {
        //compare txtidx loop to currtxt idx and skip that
        continue
      }
      drawText(txt.x, txt.y, txt.fontSize, txt.fill, txt.text, txt.font)
    }
    drawText(
      gCurrSelections.x,
      gCurrSelections.y,
      fontSize,
      gCurrSelections.fill,
      gCurrSelections.text,
      gCurrSelections.font
    )

    gCurrMeme.txts[gCurrTxtIdx - 1].fontSize = fontSize
    onMarkCurrTxt(true)
  }
  img.src = gCurrMemeImage.url
}

//SET & RESET SELECTIONS
//-------------------------------------------------
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

function setSelections(x, y, font, fontSize, stroke, align, text, fill) {
  gCurrSelections.x = x
  gCurrSelections.y = y
  gCurrSelections.font = font
  gCurrSelections.fontSize = fontSize
  gCurrSelections.stroke = stroke
  gCurrSelections.align = align
  gCurrSelections.text = text
  gCurrSelections.fill = fill
}
function onAlignTxt(align, el) {
  console.log('removed fucntion')
}

function onRemoveTxt() {
  let img = new Image()

  img.onload = () => {
    resizeCanvas(img.width, img.height)
    gCtx.drawImage(img, 0, 0, img.width, img.height)
    gCurrSelections.x = img.width / 2
    let words = gCurrMeme.txts.length
    for (let i = 0; i < words; i++) {
      const txt = gCurrMeme.txts[i]
      if (i + 1 === gCurrTxtIdx) {
        gCurrMeme.txts.splice(i, 1)
        onMarkCurrTxt()
        continue
      }
      drawText(txt.x, txt.y, txt.fontSize, txt.fill, txt.text, txt.font)
    }
  }
  img.src = gCurrMemeImage.url
}

//MARKING
//-------------------------------------------------
function onChangeCurrTxt() {
  if (gCurrTxtIdx == gCurrMeme.txts.length) {
    gCurrTxtIdx = 0
  }
  gCurrTxtIdx++

  onMarkCurrTxt()
}

function drawRect(x, y, width, height) {
  gCtx.beginPath()
  gCtx.rect(x, y, width, height)
  gCtx.strokeStyle = 'white'
  gCtx.stroke()
}

function onMarkCurrTxt(noDraw) {
  let idx = gCurrTxtIdx - 1
  if (idx < 0 || idx > 3) {
    console.log('return')
    return
  }
  let text = gCurrMeme.txts[idx]

  const { width, height } = getTextDimensions(
    text.text,
    text.fontSize,
    text.font
  )
  let x = text.x - width / 2
  let y = text.y - height / 2

  if (noDraw) {
    y += 6
    x -= 5
    drawRect(x, y, width + 10, text.fontSize)
  } else {
    y += 6
    x -= 5
    let img = new Image()
    img.onload = () => {
      resizeCanvas(img.width, img.height)
      gCtx.drawImage(img, 0, 0, img.width, img.height)
      gCurrSelections.x = img.width / 2

      for (let i = 0; i < gCurrMeme.txts.length; i++) {
        const txt = gCurrMeme.txts[i]
        drawText(txt.x, txt.y, txt.fontSize, txt.fill, txt.text, txt.font)
      }
      drawRect(x, y, width + 10, text.fontSize)
    }
    img.src = gCurrMemeImage.url
  }

  setSelections(
    text.x,
    text.y,
    text.font,
    text.fontSize,
    text.stroke,
    text.align,
    text.text,
    text.fill
  )
}

//MODAL & FLASH MSG
//-------------------------------------------------
function onDisplayModal() {
  event.stopPropagation()
  console.log('modal')
  document.querySelector('.save-share-modal').style.display = 'flex'
}
function onCloseModal() {
  console.log('closed')
  const modal = document.querySelector('.save-share-modal')
  if (modal.style.display === 'flex') {
    modal.style.display = 'none'
  }
}
function displayFlashMessage(message) {
  const flashMsgEl = document.createElement('div')
  flashMsgEl.classList.add('flash-message')
  flashMsgEl.innerText = message
  document.body.appendChild(flashMsgEl)
  setTimeout(() => {
    document.body.removeChild(flashMsgEl)
  }, 2000)
}

//SHARE / DOWNLOAD / SAVE
//-------------------------------------------------
function onShareFb() {
  console.log('share fb')
  var imgToShare = gCanvas.toDataURL('image/jpeg')
  var formData = new FormData()
  formData.append('img', imgToShare)
  fetch('http://ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData,
  })
    .then(function (res) {
      return res.text()
    })
    .then((uploadedImgUrl) => {
      uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`,
        '_blank'
      )
    })
    .catch(function (err) {
      console.error(err)
    })
}

function onDownloadMeme(el) {
  console.log(`dling ${el}`)
  const data = gCanvas.toDataURL()
  el.href = data
  el.download = 'memegen_meme.png'
}

function onSaveToGallery() {
  console.log('saved')
  const imgData = gCanvas.toDataURL()
  let meme = { imgData: imgData, editorData: gCurrMeme }
  addToMemeGallery(meme)
  setTimeout(onDisplayPage('.saved-memes'), 3000)
}
