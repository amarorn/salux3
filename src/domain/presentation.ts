import type { PresentationStep } from './types';

export const presentationMeta = {
  title: 'Proteção econômica da operação em saúde',
  subtitle: 'Era agêntica como resposta ao limite da digitalização em saúde',
  author: '',
};

export const steps: PresentationStep[] = [
  {
    id: 'cover',
    index: 0,
    title: 'PROTEÇÃO ECONÔMICA DA OPERAÇÃO EM SAÚDE',
    subtitle: 'Era agêntica como resposta ao limite da digitalização em saúde',
    position: { x: 0, y: 0 },
    scale: 1.0,
    kind: 'cover',
    accent: 'violet',
    content: {
      headline: 'Da digitalização passiva à inteligência que age.',
      body:
        'Onde a operação de saúde perde valor hoje?\nNo que é visível…\nou no que passa despercebido?\nExiste uma perda que acontece todos os dias na operação —\ne que nem sempre aparece como problema.',
      meta: {
        Edição: '01 / 2026',
        Tempo: '~12 min',
        Público: 'Liderança clínica e tecnologia',
      },
    },
  },
  {
    id: 'limit',
    index: 1,
    title: 'DIAGNÓSTICO',
    subtitle: 'Sistemas conectados, decisões ainda manuais',
    position: { x: -1480, y: -640 },
    scale: 1.35,
    kind: 'narrative',
    accent: 'rose',
    content: {
      headline: 'Onde o risco assistencial começa a se formar?',
      body:
        'Na gravidade do caso? Na complexidade do paciente? Ou no momento em que o cuidado perde continuidade?\n\nEssa é uma pergunta importante. Porque, em saúde, o risco nem sempre nasce de um evento isolado. Muitas vezes, ele se forma aos poucos.\n\nO problema não é falta de dado. É falta de continuidade.',
      bullets: [
        'Na informação que não chega completa.',
        'No histórico que precisa ser reconstruído.',
        'Na transição entre áreas.',
        'Na decisão tomada com visão parcial.',
        'Na alta que encerra o vínculo antes de encerrar o cuidado.',
      ],
    },
  },
  {
    id: 'why-agents',
    index: 2,
    title: 'Por que agentes de IA mudam o jogo',
    subtitle: 'Da automação reativa à autonomia orientada por objetivos',
    position: { x: 1460, y: -640 },
    scale: 1.35,
    kind: 'narrative',
    accent: 'cyan',
    content: {
      metrics: [
        { value: 14.6, decimals: 1, suffix: ' de glosa' },
        { value: 50, decimals: 0, suffix: ' do tempo consumido por tarefas administrativas' },
      ],
      bullets: [
        'Isso não é um desvio pontual.\nÉ um padrão.\nNão se trata apenas de ineficiência.\nÉ valor que deixa de se converter ao longo da operação.',
        'O contexto clínico precisa ser reconstruído a cada etapa.',
        'As áreas operam com leituras diferentes do mesmo caso.',
        'A decisão depende de interpretação individual.',
        'O cuidado perde fluidez entre equipes, sistemas e momentos.',
      ],
    },
  },
  {
    id: 'architecture',
    index: 3,
    title: 'Arquitetura da era agêntica',
    subtitle: 'Quatro camadas que sustentam a autonomia',
    position: { x: 1720, y: 380 },
    scale: 1.15,
    kind: 'architecture',
    accent: 'violet',
    content: {
      headline: 'Isso não é um desvio pontual. É um padrão.',
      body:
        'A operação sustenta o cuidado todos os dias. Mas ainda não sustenta continuidade de decisão ao longo da jornada.\n\nQuando o contexto se perde, o risco cresce em silêncio.\n\nEsses dados não falam apenas de eventos. Eles mostram uma fragilidade estrutural.\n\nQuando o contexto se perde, o risco cresce em silêncio. E, quando se torna visível, parte dele já se materializou.',
      bullets: [
        'Falhas nas transições de cuidado podem estar associadas a até 80% dos eventos adversos graves.',
        'Em áreas críticas, até 15% dos pacientes podem apresentar complicações não detectadas imediatamente.',
      ],
    },
  },
  {
    id: 'journey',
    index: 4,
    title: 'Jornada do usuário/paciente',
    subtitle: 'Do primeiro contato à continuidade do cuidado',
    position: { x: 920, y: 1320 },
    scale: 1.25,
    kind: 'journey',
    accent: 'emerald',
    content: {
      headline: 'O agente é discreto — a experiência é evidente.',
      body:
        'O paciente conversa em linguagem natural. Por trás, agentes coordenam triagem, agenda, autorização e follow-up sem fricção visível.',
      bullets: [
        'Triagem assistida em segundos, com explicabilidade clínica',
        'Agendamento que entende rede, urgência e preferência',
        'Pré-consulta enriquecida: histórico já lido, exames pareados',
        'Pós-consulta ativa: aderência, alertas, retorno proativo',
      ],
    },
  },
  {
    id: 'integration',
    index: 5,
    title: 'Integração com dados e sistemas legados',
    subtitle: 'Sem rip-and-replace; com interoperabilidade real',
    position: { x: -940, y: 1320 },
    scale: 1.25,
    kind: 'integration',
    accent: 'cyan',
    content: {
      headline: 'O legado é parceiro, não obstáculo.',
      body:
        'Adapters tipados, FHIR/HL7 e barramentos de eventos transformam sistemas existentes em ferramentas que o agente sabe operar.',
      bullets: [
        'Conectores nativos: TASY, MV, Soul MV, Pixeon, Philips, Cerner',
        'Eventos clínicos em tempo real via FHIR Subscriptions',
        'Mapeamento semântico com vocabulários (SNOMED, LOINC, CID-11)',
        'Camada anti-corrupção que isola mudanças no agente',
      ],
    },
  },
  {
    id: 'governance',
    index: 6,
    title: 'Governança, segurança e LGPD',
    subtitle: 'Agência com responsabilidade verificável',
    position: { x: -1720, y: 380 },
    scale: 1.35,
    kind: 'governance',
    accent: 'amber',
    content: {
      headline: 'Autonomia exige rastro.',
      body:
        'Cada decisão do agente deixa rastro auditável: qual modelo, com quais dados, sob qual política, com qual alçada. Compliance não é módulo — é fundação.',
      bullets: [
        'Políticas declarativas por especialidade e por risco',
        'Mascaramento e segregação por finalidade (LGPD art. 6º)',
        'Logs imutáveis e explicabilidade por decisão',
        'Kill switch operacional + revisão humana obrigatória',
      ],
      meta: {
        Conformidade: 'LGPD · ISO 27001 · HDS',
        Princípios: 'Minimização · Finalidade · Transparência',
      },
    },
  },
  {
    id: 'roadmap',
    index: 7,
    title: 'Roadmap de adoção',
    subtitle: 'Quatro fases, valor a cada trimestre',
    position: { x: 0, y: 1900 },
    scale: 1.2,
    kind: 'roadmap',
    accent: 'violet',
    content: {
      headline: 'Adotar agentes é um processo, não um evento.',
      body:
        'O caminho começa com casos de uso de baixo risco e alta alavancagem, expandindo escopo e autonomia conforme a confiança operacional cresce.',
      bullets: [
        'Fase 1 · Copiloto: assistência sob supervisão humana',
        'Fase 2 · Agente vertical: autonomia em fluxo restrito',
        'Fase 3 · Orquestração: múltiplos agentes coordenados',
        'Fase 4 · Plataforma: agentes como capacidade institucional',
      ],
    },
  },
  {
    id: 'closing',
    index: 8,
    title: 'Encerramento',
    subtitle: 'A próxima década da saúde será escrita por agentes',
    position: { x: 0, y: -1480 },
    scale: 1.4,
    kind: 'closing',
    accent: 'violet',
    content: {
      headline: 'Não é sobre IA. É sobre cuidado em escala.',
      body:
        'A era agêntica devolve tempo às equipes clínicas, atenção aos pacientes e previsibilidade às operações. A pergunta deixou de ser "se" — passou a ser "com quem".',
      meta: {
        Próximo: 'Workshop de descoberta · 2 horas',
        Contato: 'salux@beanalytic.com.br',
      },
    },
  },
];

export const stepsById: Record<string, PresentationStep> = Object.fromEntries(
  steps.map((s) => [s.id, s]),
);
