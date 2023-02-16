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

function onEditMeme(id) {
  const img = getImgs(id)
  resetSelections()
  drawImgOnCanvas(img)
  gCurrMeme = img
  onDisplayPage('.editor-page')
}

//BUGGED
function onWriteTxt(el) {
  gCurrSelections.text = el.value
  console.log(el.value)
  onAddTxt(gCurrSelections.fill, gCurrSelections.stroke)
}

//BUGGED
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
  gCurrSelections.fontSize = parseInt(
    document.querySelector('.font-size span').innerText
  )
  gCurrSelections.font = document.querySelector('.change-font').value
  gCtx.lineWidth = '2'
  gCtx.strokeStyle = gCurrSelections.stroke
  gCtx.fillStyle = gCurrSelections.fill
  gCtx.font = `${gCurrSelections.fontSize}px ${gCurrSelections.font}`
  gCtx.textAlign = gCurrSelections.align
  drawText(
    gCurrSelections.x,
    gCurrSelections.y,
    gCurrSelections.fontSize,
    gCurrSelections.fill,
    txt,
    gCurrSelections.font
  )
  document.querySelector('.meme-text').value = ''
}

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

//BUGGED
function onChangeFill(el) {
  gCurrSelections.fill = el.value
  onAddTxt(el.value, gCurrSelections.stroke, true)
}
//BUGGED
function onChangeBorder(el) {
  gCurrSelections.stroke = el.value
  onAddTxt(gCurrSelections.fill, el.value, true)
}

//BUGGED
function onChangeFontSize(diff) {
  const fontSizeEl = document.querySelector('.font-size span')
  let fontSize = parseInt(fontSizeEl.innerText) + diff
  if (fontSize < 10) fontSize = 10
  fontSizeEl.innerText = fontSize

  gCurrSelections.fontSize = fontSize
  drawText(
    gCurrSelections.x,
    gCurrSelections.y,
    fontSize,
    gCurrSelections.fill,
    gCurrSelections.text,
    gCurrSelections.font
  )
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

//NOT WORKING
function onChangeCurrTxt() {
  if (!gCurrMeme.txts.length) {
    console.log('bye')
    return
  } else if (gCurrMeme.currTxtIdx >= gCurrMeme.txts.length)
    gCurrMeme.currTxtIdx = 0
  else gCurrMeme.currTxtIdx++
  markCurrTxt()
}

//NOT WORKING
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

//NOT WORKING
function onAlignTxt(align, el) {
  console.log(align)
  gCurrSelections.align = align
  document.querySelectorAll('.align-btns button').forEach((btn) => {
    btn.classList.remove('active')
  })
  el.classList.add('active')
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
  const modal = document.querySelector('.save-share-modal')
  if (modal.style.display === 'flex') {
    modal.style.display = 'none'
  }
}

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
