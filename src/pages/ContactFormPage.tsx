import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePresentationStore } from '@/store/presentationStore';
import { tracksById } from '@/domain/tracks';
import { theme } from '@/domain/theme';
import { SPRING, EASE } from '@/lib/motion/curves';

interface FormState {
  nome: string;
  empresa: string;
  cargo: string;
  email: string;
  telefone: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;
type AccentColors = { base: string; soft: string; strong: string };

const INITIAL_STATE: FormState = {
  nome: '',
  empresa: '',
  cargo: '',
  email: '',
  telefone: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function alpha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

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
  const currentTrackId = usePresentationStore((s) => s.currentTrackId);
  const [state, setState] = useState<FormState>(INITIAL_STATE);

  const firstStep = tracksById[currentTrackId].steps[0];
  const accentKey = (firstStep?.accent ?? 'violet') as keyof typeof theme.accents;
  const accentColors: AccentColors = theme.accents[accentKey];

  function handleChangeTrack() {
    returnToTrackSelection();
    navigate('/', { replace: true });
  }
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [trackBtnHover, setTrackBtnHover] = useState(false);

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
    <div
      className="relative min-h-screen overflow-hidden bg-[#05070d] text-white"
      style={{ '--fa': accentColors.base } as React.CSSProperties}
    >
      <BackgroundDecor accentColors={accentColors} />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-6 sm:px-10">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 transition-[border-color,background-color] hover:border-white/30 hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
            Voltar à apresentação
          </Link>
          <motion.button
            type="button"
            onClick={handleChangeTrack}
            whileTap={{ scale: 0.97 }}
            transition={SPRING.snappy}
            onHoverStart={() => setTrackBtnHover(true)}
            onHoverEnd={() => setTrackBtnHover(false)}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-[border-color,background-color] duration-200"
            style={{
              borderColor: alpha(accentColors.base, trackBtnHover ? 0.5 : 0.3),
              backgroundColor: alpha(accentColors.base, trackBtnHover ? 0.14 : 0.08),
              color: accentColors.soft,
            }}
          >
            <Compass className="h-4 w-4" strokeWidth={2} aria-hidden />
            Selecionar outra trilha
          </motion.button>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35">
          Contato · Salux
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-stretch px-6 pb-16 pt-6 sm:px-10">
        {status === 'success' ? (
          <SuccessPanel accentColors={accentColors} />
        ) : (
          <FormCard
            state={state}
            errors={errors}
            status={status}
            submitError={submitError}
            accentColors={accentColors}
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
  accentColors: AccentColors;
  onChange: (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function FormCard({ state, errors, status, submitError, accentColors, onChange, onSubmit }: FormCardProps) {
  const submitting = status === 'submitting';
  const [btnHover, setBtnHover] = useState(false);
  const base = accentColors.base;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.85)] sm:p-10">
      <header className="mb-8">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: alpha(base, 0.85) }}
        >
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
        <Field id="nome" label="Nome" value={state.nome} onChange={onChange('nome')} autoComplete="name" error={errors.nome} accentBase={base} required />
        <Field id="empresa" label="Empresa" value={state.empresa} onChange={onChange('empresa')} autoComplete="organization" error={errors.empresa} accentBase={base} required />
        <Field id="cargo" label="Cargo" value={state.cargo} onChange={onChange('cargo')} autoComplete="organization-title" error={errors.cargo} accentBase={base} required />
        <Field id="email" label="E-mail" type="email" value={state.email} onChange={onChange('email')} autoComplete="email" inputMode="email" error={errors.email} accentBase={base} required />
        <Field id="telefone" label="Telefone" type="tel" value={state.telefone} onChange={onChange('telefone')} autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" error={errors.telefone} accentBase={base} required />

        {status === 'error' && submitError && (
          <p role="alert" className="text-sm text-rose-300/90">
            {submitError}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-[11px] text-white/45">
            Ao enviar, você concorda em ser contactado pela equipe Salux.
          </p>
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={submitting ? undefined : { scale: 0.97 }}
            transition={SPRING.snappy}
            onHoverStart={() => setBtnHover(true)}
            onHoverEnd={() => setBtnHover(false)}
            className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-[border-color,background-color] duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: alpha(base, btnHover ? 0.6 : 0.4),
              backgroundColor: alpha(base, btnHover ? 0.22 : 0.15),
              color: accentColors.soft,
              boxShadow: `0 18px 48px -22px ${alpha(base, 0.55)}`,
            }}
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
          </motion.button>
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
  accentBase: string;
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
  accentBase,
}: FieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
        {label}
        {required && (
          <span className="ml-1" style={{ color: alpha(accentBase, 0.85) }}>
            *
          </span>
        )}
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
        className="form-field-input w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/30 transition-[border-color,background-color,box-shadow] duration-200"
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="text-xs text-rose-300/90">
          {error}
        </span>
      )}
    </label>
  );
}

function SuccessPanel({ accentColors }: { accentColors: AccentColors }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32, scale: 0.96, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.65, ease: EASE.cinematic }}
      className="flex flex-col items-center gap-6 rounded-3xl border border-emerald-400/25 bg-emerald-500/[0.05] p-10 text-center"
      style={{
        boxShadow: `0 30px 80px -30px rgba(16,185,129,0.3), 0 30px 80px -30px ${alpha(accentColors.base, 0.18)}`,
      }}
    >
      <motion.span
        aria-hidden
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.18, ...SPRING.gentle }}
        className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/15"
        style={{ boxShadow: `0 0 32px ${alpha(accentColors.base, 0.25)}` }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, ...SPRING.snappy }}
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-300" strokeWidth={2} />
        </motion.div>
      </motion.span>

      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE.cinematic }}
      >
        <h2 className="font-display text-2xl font-bold text-white">Recebemos seus dados</h2>
        <p className="max-w-sm text-sm text-white/70">
          Nossa equipe entra em contato em breve para agendar a conversa. Obrigado pelo interesse.
        </p>
      </motion.div>
    </motion.section>
  );
}

function BackgroundDecor({ accentColors }: { accentColors: AccentColors }) {
  const base = accentColors.base;
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${alpha(base, 0.18)} 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 90%, ${alpha(base, 0.1)} 0%, transparent 65%)`,
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
