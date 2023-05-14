import fs from 'node:fs'

const songs = []

fs
  .readdirSync('./public/static/mp3')
  .forEach(_ => {
    if(!_.endsWith('mp3')) {
      return
    }

    const [index, nameAndMp3] = _.split('_')
    const [name] = nameAndMp3.split('.')

    songs[+index - 1] = name
  })

fs.writeFileSync('./src/common/songs.ts', `export default [${songs.map(_ => {
  return `\n\t'${_}'`
})}\n]`)
