import { useCallback, useState } from 'react';
import { sanitizeEmail, sanitizeHtml, sanitizeText, sanitizeUrl } from '@/utils/sanitizer';

type InputMode = 'text' | 'html' | 'url' | 'email';

const sanitizeByMode = (value: string, mode: InputMode) => {
  switch (mode) {
    case 'html':
      return sanitizeHtml(value);
    case 'url':
      return sanitizeUrl(value);
    case 'email':
      return sanitizeEmail(value);
    default:
      return sanitizeText(value);
  }
};

export function useSanitizedInput(initialValue = '', mode: InputMode = 'text') {
  const sanitize = useCallback((value: string) => sanitizeByMode(value ?? '', mode), [mode]);

  const [value, setValue] = useState(() => sanitize(initialValue));

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(sanitize(event.target.value));
    },
    [sanitize],
  );

  const setSanitizedValue = useCallback(
    (nextValue: string) => {
      setValue(sanitize(nextValue));
    },
    [sanitize],
  );

  const reset = useCallback(() => {
    setValue(sanitize(initialValue));
  }, [initialValue, sanitize]);

  return {
    value,
    onChange: handleChange,
    setValue: setSanitizedValue,
    reset,
  };
}

export type UseSanitizedInputReturn = ReturnType<typeof useSanitizedInput>;
