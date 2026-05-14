/**
 * URL do formulário (Typeform, Google Forms, etc.). Opcional: `VITE_CONTACT_FORM_URL` em `.env`.
 * Sem env, usa e-mail em `meta.Contato` do slide de encerramento (mailto) quando existir.
 * Caso contrário, navega para a página interna `/formulario`.
 */
export function resolveContactFormUrl(metaContact?: string): string {
  const env = import.meta.env.VITE_CONTACT_FORM_URL?.trim();
  if (env) return env;
  if (metaContact && metaContact.includes('@')) {
    const subj = encodeURIComponent('Contato — apresentação Salux');
    return `mailto:${metaContact}?subject=${subj}`;
  }
  return '/formulario';
}
