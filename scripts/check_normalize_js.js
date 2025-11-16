// Quick JS validation of normalizeSrcSet logic (independent of TS loader issues)
function safeDecode(seg) {
  try {
    return decodeURIComponent(seg);
  } catch {
    return seg;
  }
}

function encodeUrlSegments(raw) {
  if (!raw) return raw;
  // handle hash
  const [withoutHash, hash] = raw.split('#');
  const [pathPart, queryPart] = (withoutHash || '').split('?');
  const encodedPath = pathPart
    .split('/')
    .map((seg) => (seg ? encodeURIComponent(safeDecode(seg)) : ''))
    .join('/');
  const q = queryPart ? `?${queryPart}` : '';
  const h = hash ? `#${hash}` : '';
  return `${encodedPath}${q}${h}`;
}

function normalizeSrcSet(srcSet) {
  if (!srcSet) return undefined;
  return srcSet
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
    .map((entry) => {
      const lastSpace = entry.lastIndexOf(' ');
      let rawUrl, maybeDesc;
      if (lastSpace > -1) {
        rawUrl = entry.slice(0, lastSpace).trim();
        maybeDesc = entry.slice(lastSpace + 1).trim();
      } else {
        rawUrl = entry;
        maybeDesc = '';
      }
      let desc = maybeDesc || '';
      if (!desc) {
        const match = rawUrl.match(/[_-](\d{2,4})(?=\.[a-z]{2,4}(?:$|\?))/i);
        if (match) desc = `${match[1]}w`;
      } else if (/^\d+$/.test(desc)) {
        desc = `${desc}w`;
      }
      const encoded = encodeUrlSegments(rawUrl || '');
      return desc ? `${encoded} ${desc}` : `${encoded}`;
    })
    .join(', ');
}

const samples = [
  '/Jpeg/CoQ10, 100 mg Anverso.webp 320, /Jpeg/CoQ10, 100 mg Anverso.webp 480w',
  '/optimized/product-640.webp',
  '',
  undefined,
];

for (const s of samples) {
  console.log('IN:', s);
  console.log('OUT:', normalizeSrcSet(s));
  console.log('---');
}

// simple assertions
const out1 = normalizeSrcSet(samples[0]);
if (!out1 || !out1.includes('%2C') || !/320w/.test(out1)) {
  console.error('Check failed for sample 0:', out1);
  process.exitCode = 2;
} else {
  console.log('Basic checks passed');
}
