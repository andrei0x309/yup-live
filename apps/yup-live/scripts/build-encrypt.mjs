import fs from 'fs'
import path from 'path'
import { encrypt } from '@andrei0x309/pagecrypt-light-backend'

function getEncKey() {
  if (process.env.ENK_KEY) return process.env.ENK_KEY
  const env = fs.readFileSync('.env', 'utf8')
  const lines = env.split('\n')
  const line = lines.find((line) => line.startsWith('ENK_KEY='))
  if (!line) throw new Error('ENK_KEY not found in .env')
  const key = line.split('=')[1]
  if (!key) throw new Error('ENK_KEY not found in .env')
  return key
}
function getHtmlFiles(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject(err)
      } else {
        const htmlFiles = files.filter((file) => path.extname(file) === '.html')
        resolve(htmlFiles)
      }
    })
  })
}

const enc_file = async (filename, ENK_KEY) => {
  const f_dest = 'dist/' + filename
  await encrypt(f_dest, 'dist/encrypted.html', ENK_KEY)
  fs.unlinkSync(f_dest)
  fs.renameSync('dist/encrypted.html', f_dest)
  console.log(`Encrypted [${f_dest}]`)
}

const enc_build_files = async () => {
  const ENK_KEY = getEncKey()
  const files = (await getHtmlFiles('dist')).filter((f) => f !== 'get-access.html' && !(f ?? '').includes('google'))
  for (const f of files) {
    await enc_file(f, ENK_KEY)
  }
  console.log('Done running [enc_build_files]')
}

enc_build_files()
