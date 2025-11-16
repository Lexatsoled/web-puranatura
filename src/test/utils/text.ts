// Utilidades de texto para tests (normalización de tildes/diacríticos)
export const normalizeText = (s: string): string =>
  (s ?? '')
    .normalize('NFD')
    // Rango Unicode de marcas combinantes sin depender de propiedades ICU
    .replace(/[\u0300-\u036f]/g, '')
    // Remover caracteres de reemplazo y control comunes en mojibake
    // eslint-disable-next-line no-control-regex
    .replace(/[\uFFFD\u0000-\u001F]/g, '')
    .toLowerCase();

export const includesText = (needle: string) => (content: string): boolean =>
  normalizeText(content).includes(normalizeText(needle));
