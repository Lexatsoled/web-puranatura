import fs from 'fs';
import path from 'path';

const tokensDir = path.join(process.cwd(), 'backend', 'reports');
const tokensFile = path.join(tokensDir, 'refresh-tokens.json');

if (!fs.existsSync(tokensDir)) {
  fs.mkdirSync(tokensDir, { recursive: true });
}

type TokenEntry = { jti: string; userId: string; expiresAt?: string | null };

const readStore = (): TokenEntry[] => {
  try {
    const s = fs.readFileSync(tokensFile, 'utf8');
    return JSON.parse(s || '[]');
  } catch (err) {
    return [];
  }
};

const writeStore = (entries: TokenEntry[]) => {
  fs.writeFileSync(tokensFile, JSON.stringify(entries, null, 2), 'utf8');
};

export const addToken = (entry: TokenEntry) => {
  const entries = readStore();
  entries.push(entry);
  writeStore(entries);
};

export const revokeToken = (jti: string) => {
  const entries = readStore().filter((e) => e.jti !== jti);
  writeStore(entries);
};

export const hasToken = (jti: string) => {
  const entries = readStore();
  return entries.some((e) => e.jti === jti);
};

export const replaceToken = (oldJti: string, newEntry: TokenEntry) => {
  const entries = readStore().filter((e) => e.jti !== oldJti);
  entries.push(newEntry);
  writeStore(entries);
};

export default { addToken, hasToken, revokeToken, replaceToken };
