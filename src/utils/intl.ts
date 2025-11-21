const formatterCache = new Map<string, Intl.NumberFormat>();

const getCurrencyFormatter = (currency: string, locale = 'es-DO') => {
  const key = `${locale}-${currency}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      })
    );
  }
  return formatterCache.get(key)!;
};

export const formatCurrency = (
  value: number,
  currency: string = 'DOP',
  locale = 'es-DO'
) => getCurrencyFormatter(currency, locale).format(value);

const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

const getDateFormatter = (
  locale: string,
  options?: Intl.DateTimeFormatOptions
) => {
  const key = `${locale}-${JSON.stringify(options || {})}`;
  if (!dateFormatterCache.has(key)) {
    dateFormatterCache.set(key, new Intl.DateTimeFormat(locale, options));
  }
  return dateFormatterCache.get(key)!;
};

export const formatDate = (
  date: Date | string,
  locale = 'es-DO',
  options?: Intl.DateTimeFormatOptions
) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }
  return getDateFormatter(locale, options).format(parsedDate);
};
