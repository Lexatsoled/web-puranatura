/**
 * Sanitiza un objeto para ser serializado como JSON-LD de forma segura,
 * escapando caracteres HTML peligrosos para prevenir XSS en inyecciones <script>.
 *
 * @param data Objeto a serializar
 * @returns JSON string con caracteres <, >, y & escapados
 */
export const safeJSONLDSerialization = (data: any): string => {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
};
