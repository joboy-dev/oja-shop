import DOMPurify from 'dompurify';
import { z } from 'zod';

export const richTextSchema = z.string()
  .trim() // Remove leading/trailing whitespace
  .transform(html => {
    // Sanitize the HTML before passing it through
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true } // Or customize allowed tags/attributes
    });
  })
  .refine(sanitizedHtml => {
    // Optional: further check if the sanitized HTML is still effectively empty
    // after removing tags (e.g., if it was just "<p><br></p>")
    const strippedText = sanitizedHtml.replace(/<[^>]*>/g, '').trim();
    return strippedText.length > 0;
});

export const additionalInfoSchema = z.array(z.object({
  key: z.string(),
  value: z.string(),
}))
