// Remove HTML tags and trim whitespace
export function sanitizeInput(value: string): string {
    return value.replace(/<[^>]*>?/gm, "").trim();
  }
  
  // Sanitize an entire object
  export function sanitizeForm<T extends Record<string, any>>(form: T): T {
    const sanitized: Record<string, any> = {};
    for (const key in form) {
      const val = form[key];
      sanitized[key] = typeof val === "string" ? sanitizeInput(val) : val;
    }
    return sanitized as T;
  }