import { config } from '../config';

// -- formatMessage --
export const formatMessage = (
  template: string,
  replacements?: Record<string, string | number>,
): string => {
  let message = template.replace(/{prefix}/g, config.prefix);

  if (replacements) {
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{${key}}`, 'g');
      message = message.replace(regex, String(value));
    }
  }

  return message;
};
