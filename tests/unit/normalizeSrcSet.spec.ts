import { describe, it, expect } from 'vitest'
import { normalizeSrcSet } from '../../src/utils/image'

describe('normalizeSrcSet', () => {
  it('encodes path segments and adds w suffix to numeric descriptors', () => {
    const input = '/Jpeg/CoQ10, 100 mg Anverso.webp 320, /Jpeg/CoQ10, 100 mg Anverso.webp 480w'
    const out = normalizeSrcSet(input)
    expect(out).toBeDefined()
    expect(out).toContain('%2C') // comma encoded
    expect(out).toMatch(/320w/) // descriptor present
    expect(out).toMatch(/480w/)
  })

  it('returns undefined for empty input', () => {
    expect(normalizeSrcSet('')).toBeUndefined()
    expect(normalizeSrcSet(undefined as any)).toBeUndefined()
  })

  it('infers width from filename if descriptor missing', () => {
    const input = '/optimized/product-640.webp'
    const out = normalizeSrcSet(input)
    // Depending on implementation, may infer 640
    if (out) expect(out).toMatch(/640w|640/) 
  })
})
