
// let gKeywords = { happy: 13, sad: 1 }
// let gFilter = ''
// function getKeywordsById(id) {
//     switch (id) {
//       case 1:
//         return ['politics', 'trump']
//       case 2:
//         return ['dog', 'pet', 'animal']
//       case 3:
//         return ['baby', 'cute', 'smiling']
//       case 4:
//         return ['politics', 'cute', 'smiling']
//       case 5:
//         return ['baby', 'cute', 'smiling']
//       case 6:
//         return ['baby', 'cute', 'smiling']
//       case 7:
//         return ['baby', 'cute', 'smiling']
//       case 8:
//         return ['baby', 'cute', 'smiling']
//       case 9:
//         return ['baby', 'cute', 'smiling']
//       case 10:
//         return ['baby', 'cute', 'smiling']
//       case 11:
//         return ['baby', 'cute', 'smiling']
//       case 12:
//         return ['baby', 'cute', 'smiling']
//       case 13:
//         return ['baby', 'cute', 'smiling']
//       case 14:
//         return ['baby', 'cute', 'smiling']
//       case 15:
//         return ['baby', 'cute', 'smiling']
//       case 16:
//         return ['baby', 'cute', 'smiling']
//       case 17:
//         return ['baby', 'cute', 'smiling']
//       case 18:
//         return ['baby', 'cute', 'smiling']
//     }
//   }

//   function onSearch(elInput) {
//     console.log('reached')
//     gFilter = elInput.value.trim().toLowerCase()
//     renderGallery()
//   }

//   function getFilteredImgs() {
//     if (!gFilter) {
//       return gImgs
//     } else {
//       return gImgs.filter((img) =>
//         img.keywords.some((kw) => kw.toLowerCase().includes(gFilter))
//       )
//     }
//   }
