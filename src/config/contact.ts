/**
 * URL do formulário. Por padrão usa a página interna `/formulario`.
 * Pode ser sobrescrita por `VITE_CONTACT_FORM_URL` (Typeform, Google Forms, etc.).
 * O parâmetro `metaContact` é aceito por compatibilidade com chamadas existentes,
 * mas não força mais um link `mailto:` — todas as chamadas levam ao formulário.
 */
export function resolveContactFormUrl(_metaContact?: string): string {
  const env = import.meta.env.VITE_CONTACT_FORM_URL?.trim();
  if (env) return env;
  return '/formulario';
}
