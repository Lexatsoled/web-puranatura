import { useTranslation } from 'react-i18next';
import { format as formatDateFns } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const locales = { es, en: enUS };

export function useFormatting() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language as 'es' | 'en';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currentLocale === 'es' ? 'EUR' : 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string, format: string = 'PPP'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDateFns(dateObj, format, {
      locale: locales[currentLocale],
    });
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(currentLocale).format(num);
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat(currentLocale, { numeric: 'auto' });

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return rtf.format(-diffMins, 'minute');
      }
      return rtf.format(-diffHours, 'hour');
    }

    if (diffDays < 7) {
      return rtf.format(-diffDays, 'day');
    }

    return formatDate(date);
  };

  return {
    formatCurrency,
    formatDate,
    formatNumber,
    formatRelativeTime,
  };
}