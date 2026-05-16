import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Loader2 } from 'lucide-react';
import { usePresentationStore } from '@/store/presentationStore';

interface FormState {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  nome: '',
  empresa: '',
  cargo: '',
  email: '',
  telefone: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(state: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!state.nome.trim()) errors.nome = 'Informe o seu nome.';
  if (!state.empresa.trim()) errors.empresa = 'Informe a empresa.';
  if (!state.cargo.trim()) errors.cargo = 'Informe o cargo.';
  if (!state.email.trim()) errors.email = 'Informe um e-mail.';
  else if (!EMAIL_REGEX.test(state.email.trim())) errors.email = 'E-mail inválido.';
  if (!state.telefone.trim()) errors.telefone = 'Informe um telefone.';
  else if (state.telefone.replace(/\D/g, '').length < 8) errors.telefone = 'Telefone muito curto.';
  return errors;
}

async function submitForm(state: FormState): Promise<void> {
  const endpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim();
  if (!endpoint) {
    // Sem endpoint configurado: simula latência para feedback visual.
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    return;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error(`Falha ao enviar (${res.status})`);
}

export function ContactFormPage() {
  const navigate = useNavigate();
  const returnToTrackSelection = usePresentationStore((s) => s.returnToTrackSelection);
  const [state, setState] = useState<FormState>(INITIAL_STATE);

  function handleChangeTrack() {
    returnToTrackSelection();
    navigate('/', { replace: true });
  }
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  function onChange(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setState((s) => ({ ...s, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(state);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStatus('submitting');
    setSubmitError(null);
    try {
      await submitForm(state);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível enviar.');
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      <BackgroundDecor />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-6 sm:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 transition-[border-color,background-color] hover:border-white/30 hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
            Voltar à apresentação
          </Link>
          <button
            type="button"
            onClick={handleChangeTrack}
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-100 transition-[border-color,background-color] hover:border-violet-400/50 hover:bg-violet-500/[0.14]"
          >
            <Compass className="h-4 w-4" strokeWidth={2} aria-hidden />
            Selecionar outra trilha
          </button>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35">
          Contato · Salux
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-stretch px-6 pb-16 pt-6 sm:px-10">
        {status === 'success' ? (
          <SuccessPanel />
        ) : (
          <FormCard
            state={state}
            errors={errors}
            status={status}
            submitError={submitError}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        )}
      </main>
    </div>
  );
}

interface FormCardProps {
  state: FormState;
  errors: FieldErrors;
  status: 'idle' | 'submitting' | 'success' | 'error';
  submitError: string | null;
  onChange: (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function FormCard({ state, errors, status, submitError, onChange, onSubmit }: FormCardProps) {
  const submitting = status === 'submitting';
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] sm:p-10">
      <header className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-violet-300/80">
          Conversa direta
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          Conte-nos sobre você
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
          Deixe os dados abaixo e nossa equipe entra em contato para mapear onde a sua
          operação está perdendo valor hoje.
        </p>
      </header>

      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-5">
        <Field
          id="nome"
          label="Nome"
          value={state.nome}
          onChange={onChange('nome')}
          autoComplete="name"
          error={errors.nome}
          required
        />
        <Field
          id="empresa"
          label="Empresa"
          value={state.empresa}
          onChange={onChange('empresa')}
          autoComplete="organization"
          error={errors.empresa}
          required
        />
        <Field
          id="cargo"
          label="Cargo"
          value={state.cargo}
          onChange={onChange('cargo')}
          autoComplete="organization-title"
          error={errors.cargo}
          required
        />
        <Field
          id="email"
          label="E-mail"
          type="email"
          value={state.email}
          onChange={onChange('email')}
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          required
        />
        <Field
          id="telefone"
          label="Telefone"
          type="tel"
          value={state.telefone}
          onChange={onChange('telefone')}
          autoComplete="tel"
          inputMode="tel"
          placeholder="(11) 99999-9999"
          error={errors.telefone}
          required
        />

        {status === 'error' && submitError && (
          <p role="alert" className="text-sm text-rose-300/90">
            {submitError}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-[11px] text-white/45">
            Ao enviar, você concorda em ser contactado pela equipe Salux.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/15 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100 shadow-[0_18px_48px_-22px_rgba(124,58,237,0.55)] transition-[border-color,background-color,transform] hover:border-violet-400/60 hover:bg-violet-500/22 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                Enviando
              </>
            ) : (
              <>
                Enviar
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  placeholder?: string;
  error?: string;
  required?: boolean;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  error,
  required,
}: FieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
        {label}
        {required && <span className="ml-1 text-violet-300/80">*</span>}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/30 transition-[border-color,background-color] focus:border-violet-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/30"
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="text-xs text-rose-300/90">
          {error}
        </span>
      )}
    </label>
  );
}

function SuccessPanel() {
  return (
    <section className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-400/25 bg-emerald-500/[0.05] p-10 text-center shadow-[0_30px_80px_-30px_rgba(16,185,129,0.45)]">
      <span
        aria-hidden
        className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/15"
      >
        <CheckCircle2 className="h-8 w-8 text-emerald-300" strokeWidth={2} />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl font-bold text-white">Recebemos seus dados</h2>
        <p className="max-w-sm text-sm text-white/70">
          Nossa equipe entra em contato em breve para agendar a conversa. Obrigado pelo interesse.
        </p>
      </div>
    </section>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 90%, rgba(6,182,212,0.12) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
        }}
      />
    </>
  );
}
