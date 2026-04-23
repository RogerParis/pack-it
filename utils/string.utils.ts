export const sanitizePromptInput = (input: string) =>
  input
    .replace(/[\n\r]/g, ' ')
    .trim()
    .slice(0, 200);
