import fs from 'node:fs'

const lrcList = fs.readdirSync('./').filter(path => path.endsWith('.lrc'))
const mp3List = fs.readdirSync('../mp3/').filter(path => path.endsWith('.mp3'))

for (let i = 0; i < 400; i++) {
  const lrcName = lrcList[i].split('.')[0]
  const mp3Name = mp3List[i].split('.')[0]

  if(lrcName !== mp3Name) {
    console.log('error')
  }
}
