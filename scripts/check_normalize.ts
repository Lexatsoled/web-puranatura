import { normalizeSrcSet } from '../src/utils/image.ts'

const samples = [
  '/Jpeg/CoQ10, 100 mg Anverso.webp 320, /Jpeg/CoQ10, 100 mg Anverso.webp 480w',
  '/optimized/product-640.webp',
  '',
  undefined as any,
]

for (const s of samples) {
  try {
    console.log('IN:', s)
    const out = normalizeSrcSet(s)
    console.log('OUT:', out)
  } catch (err) {
    console.error('ERR', err)
  }
}
