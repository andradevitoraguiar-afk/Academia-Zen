import { Discipline, DaySchedule } from './types';

export const WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    day: 'Segunda-feira',
    shortDay: 'SEG',
    sessions: [
      { id: 's-mon-1', time: '07:00', disciplineId: 'bjj', title: 'Zen Jitsu - Despertar', instructor: 'Mestre Zen', duration: '60 min' },
      { id: 's-mon-2', time: '18:30', disciplineId: 'muaythai', title: 'Muay Thai - Fundamentos', instructor: 'Kru Thai', duration: '90 min' },
      { id: 's-mon-3', time: '20:00', disciplineId: 'bjj', title: 'Zen Jitsu - Avançado (Gi)', instructor: 'Mestre Zen', duration: '90 min' },
    ]
  },
  {
    day: 'Terça-feira',
    shortDay: 'TER',
    sessions: [
      { id: 's-tue-1', time: '07:00', disciplineId: 'muaythai', title: 'Muay Thai - Condicionamento', instructor: 'Kru Thai', duration: '60 min' },
      { id: 's-tue-2', time: '12:00', disciplineId: 'bjj', title: 'Zen Jitsu - Almoço (No Gi)', instructor: 'Coach Silva', duration: '60 min' },
      { id: 's-tue-3', time: '19:00', disciplineId: 'wrestling', title: 'Wrestling - Quedas & Controle', instructor: 'Coach Snap', duration: '90 min' },
    ]
  },
  {
    day: 'Quarta-feira',
    shortDay: 'QUA',
    sessions: [
      { id: 's-wed-1', time: '07:00', disciplineId: 'bjj', title: 'Zen Jitsu - Drills', instructor: 'Mestre Zen', duration: '60 min' },
      { id: 's-wed-2', time: '18:30', disciplineId: 'muaythai', title: 'Muay Thai - Sparring & Clinch', instructor: 'Kru Thai', duration: '90 min' },
      { id: 's-wed-3', time: '20:00', disciplineId: 'bjj', title: 'Zen Jitsu - Competição', instructor: 'Mestre Zen', duration: '90 min' },
    ]
  },
  {
    day: 'Quinta-feira',
    shortDay: 'QUI',
    sessions: [
      { id: 's-thu-1', time: '07:00', disciplineId: 'wrestling', title: 'Wrestling - Defesa de Quedas', instructor: 'Coach Snap', duration: '60 min' },
      { id: 's-thu-2', time: '12:00', disciplineId: 'bjj', title: 'Zen Jitsu - Almoço (Gi)', instructor: 'Coach Silva', duration: '60 min' },
      { id: 's-thu-3', time: '19:00', disciplineId: 'bjj', title: 'Zen Jitsu - Fundamentos', instructor: 'Mestre Zen', duration: '90 min' },
    ]
  },
  {
    day: 'Sexta-feira',
    shortDay: 'SEX',
    sessions: [
      { id: 's-fri-1', time: '07:00', disciplineId: 'bjj', title: 'Zen Jitsu - Open Mat', instructor: 'Supervisão', duration: '60 min' },
      { id: 's-fri-2', time: '18:30', disciplineId: 'muaythai', title: 'Muay Thai - Técnica Avançada', instructor: 'Kru Thai', duration: '90 min' },
      { id: 's-fri-3', time: '20:00', disciplineId: 'wrestling', title: 'Wrestling vs Jiu Jitsu', instructor: 'Mestre Zen & Coach Snap', duration: '90 min' },
    ]
  },
  {
    day: 'Sábado',
    shortDay: 'SÁB',
    sessions: [
      { id: 's-sat-1', time: '10:00', disciplineId: 'bjj', title: 'Aulão Geral & Graduação', instructor: 'Todos os Professores', duration: '120 min' },
    ]
  },
  {
    day: 'Domingo',
    shortDay: 'DOM',
    sessions: [] // Descanso
  }
];

export const DISCIPLINES: Discipline[] = [
  {
    id: 'bjj',
    name: 'Zen Jitsu (BJJ)',
    iconType: 'gi',
    instructor: 'Mestre Zen',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz5Dnd72vyc01viQDXF-wFb-G7Lv7DGplv_J9BUPRcVDN28EsgLMi0GlgAR7OVgy1OnWu9udD-WGXS5_qivNoIXakE_2o1b2-Wv68tHOmsAcLA4vXPRpj2az_T_qviBKkzPu03eLOOHf1AHoa0TPz-nMxkOw0jz-TpgFKqv2M7UJVZbuPtw2r26w4ZD0QSNoQUKibals2L100XdWUDNjK8N6bMC46eCbC7xtDL8MNrfC-N6ikSacmdSW3B8YVQHPqrmoiewNSo2g',
    description: 'A arte suave. Foco em alavancas, estrangulamentos e dominância no solo.',
    levels: [
      {
        id: 'bjj-white',
        name: 'Faixa Branca',
        color: 'bg-white',
        description: 'Fundamentos de defesa pessoal e sobrevivência.',
        progress: 45,
        techniques: [
          { 
            id: 't-bjj-w-1', 
            title: 'Fuga de Quadril', 
            category: 'Defesa',
            description: 'Movimento essencial para criar espaço no solo.', 
            tips: ['Não levante o quadril, deslize.', 'Use os pés para empurrar.'],
            videoUrl: 'https://www.youtube.com/watch?v=_E7jS3hvk6o'
          },
          { 
            id: 't-bjj-w-2', 
            title: 'Armlock da Guarda', 
            category: 'Finalização',
            description: 'Chave de braço partindo da guarda fechada.', 
            tips: ['Domine o braço cruzando a linha central.', 'Levante o quadril para isolar o ombro.'],
            videoUrl: 'https://www.youtube.com/results?search_query=jiu+jitsu+armlock+da+guarda+tutorial'
          },
          { 
            id: 't-bjj-w-3', 
            title: 'Triângulo', 
            category: 'Finalização',
            description: 'Estrangulamento usando as pernas.', 
            tips: ['Um braço dentro, um braço fora.', 'Ajuste o ângulo cortando para o lado.'],
            videoUrl: 'https://www.youtube.com/results?search_query=jiu+jitsu+triangulo+tutorial'
          },
          { 
            id: 't-bjj-w-4', 
            title: 'Passagem de Guarda Toreando', 
            category: 'Passagem',
            description: 'Passagem de guarda em pé.', 
            tips: ['Controle as calças na altura do joelho.', 'Use o peso do corpo.'],
            videoUrl: 'https://www.youtube.com/results?search_query=jiu+jitsu+passagem+toreando+tutorial'
          },
        ]
      },
      {
        id: 'bjj-blue',
        name: 'Faixa Azul',
        color: 'bg-blue-600',
        description: 'Programa completo do Exame de Faixa Azul.',
        progress: 10,
        techniques: [
          // 1. Fundamentos e Movimentação
          { id: 'bjj-blue-f-1', category: 'Fundamentos', title: 'Rolamentos e Saídas', description: 'Rolamento de frente, Rolamento de costas, Saída de quadril.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-f-2', category: 'Fundamentos', title: 'Base e Conexão', description: 'Base 4 lados, Base 90º com conexão (frente e trás - Kimono e Clinch lateral), Guarda alta com conexão.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-f-3', category: 'Fundamentos', title: 'Movimentação em Pé', description: 'Andar em base, Giro 90º, Andar em volta do oponente.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-f-4', category: 'Fundamentos', title: 'Aprender a Cair', description: 'Lateral, Para trás, Para frente, Levantada técnica.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-f-5', category: 'Fundamentos', title: 'Controle de Distância', description: 'Pisão Lateral, Jab/direto, Movimentação de Pernas.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-f-6', category: 'Fundamentos', title: 'Respiração', description: 'Fole, Completa, Entendimento da respiração baixa x alta.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-f-7', category: 'Fundamentos', title: 'Regras de Ouro da Defesa', description: 'Guarda Alta e Passo Atrás, Mãos Sempre pelo Meio, Empurrão para Ganhar Distância.', tips: [], videoUrl: '' },

          // 2. Defesa Pessoal
          { id: 'bjj-blue-dp-1', category: 'Defesa Pessoal', title: 'Defesas Fundamentais', description: 'Defesa de empurrão (1 e 2 mãos), Pegadas (Gola, Punho, Calça).', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-2', category: 'Defesa Pessoal', title: 'Ida para as Costas em Pé', description: 'Mão no peito, Por baixo do braço, Arm drag, Girando pelos ombros.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-3', category: 'Defesa Pessoal', title: 'Defesas em Pé (Frente) I', description: 'Contra enforcamento (mãos/quadril), Saídas de pulso, Gravata (em pé, com soco, inclinado).', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-4', category: 'Defesa Pessoal', title: 'Defesas em Pé (Frente) II', description: 'Pegadas na gola ("mão de vaca", polegar, torcendo), Pegada de ombro.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-5', category: 'Defesa Pessoal', title: 'Defesas em Pé (Frente) III', description: 'Contra baiana, Guilhotina, Agarramentos (baixo/cima), Ameaça na garganta.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-6', category: 'Defesa Pessoal', title: 'Defesas de Agressão', description: 'Contra soco/tapa (perto/longe), Empurrão no peito, Pisão, Chute lateral.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-7', category: 'Defesa Pessoal', title: 'Defesas Contra Parede', description: 'Golpes de costas, Chute reto, Enforcamento, Mão no pescoço, Empurrão, Gravata.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-8', category: 'Defesa Pessoal', title: 'Mata Leão e Gravatas', description: 'Saída da gravata em pé (4 variações), Defesa de Mata Leão (2 variações).', tips: [], videoUrl: '' },
          { id: 'bjj-blue-dp-9', category: 'Defesa Pessoal', title: 'Defesas pelas Costas', description: 'Agarramentos (cima/baixo), Gravata (puxado p/ trás), Chave cervical, Enforcamento.', tips: [], videoUrl: '' },

          // 3. Clinch e Quedas
          { id: 'bjj-blue-q-1', category: 'Quedas', title: 'Clinch Básico', description: 'Tipos de Pegada, Tipos de Abraçada, Cinturada.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-q-2', category: 'Quedas', title: 'Quedas Principais', description: 'Queda de Gancho, O soto gari, Baiana.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-q-3', category: 'Quedas', title: 'Defesa de Tapa', description: 'Com queda de quadril e chave de braço.', tips: [], videoUrl: '' },

          // 4. Chão - Passagem
          { id: 'bjj-blue-p-1', category: 'Passagem', title: 'Passagens Abertas', description: 'Tradicional (joelho/em pé), Afundando o Joelho, Guarda Aranha.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-p-2', category: 'Passagem', title: 'Passagens Justas', description: '2 mãos por baixo das pernas, Joelho Cruzado, Meia Guarda (duas passagens).', tips: [], videoUrl: '' },

          // 5. Chão - Ataque e Controle
          { id: 'bjj-blue-c-1', category: 'Controle', title: '100kg (Atravessada)', description: 'Ataques: Pescoço, Chave de braço, Americana. Transições para montada e joelho na barriga.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-c-2', category: 'Controle', title: 'Joelho na Barriga', description: 'Chave de braço, Montada, Estrangulamento.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-c-3', category: 'Controle', title: 'Montada (Manutenção)', description: 'Defesa de mão no peito, joelhos, quadril e empurrão lateral.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-c-4', category: 'Controle', title: 'Montada (Finalizações)', description: 'Chave de braço, Estrangulamento, Ataque duplo, Americana, Montada Lateral.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-c-5', category: 'Defesa no Solo', title: 'Saída de Montada', description: 'Upa, Saída de cotovelo, Saída Relson.', tips: [], videoUrl: '' },

          // 6. Chão - Guarda
          { id: 'bjj-blue-g-1', category: 'Guarda', title: 'Finalizações da Guarda', description: 'Chave de braço, Triângulo, Estrangulamento, Ataque duplo.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-g-2', category: 'Guarda', title: 'Raspagens', description: 'Tesoura (c/ e s/ gancho), Quadril (c/ e s/ guilhotina), Guarda aberta (pêndulo/chave de braço).', tips: [], videoUrl: '' },
          { id: 'bjj-blue-g-3', category: 'Guarda', title: 'Combinações', description: 'Raspagem com finalização, Ataque pescoço e braço, Ataque braço e costas.', tips: [], videoUrl: '' },

          // 7. Meia Guarda e Costas
          { id: 'bjj-blue-m-1', category: 'Meia Guarda', title: 'Ataques da Meia', description: 'Raspagem de gancho, Ida para as costas.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-m-2', category: 'Meia Guarda', title: 'Defesa de Meia', description: 'Posicionamento das mãos, Conexão joelho/cotovelo, Reposição.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-costas-1', category: 'Costas', title: 'Ida para as Costas', description: 'A partir da guarda (cruzando braço e esgrimando).', tips: [], videoUrl: '' },
          { id: 'bjj-blue-costas-2', category: 'Costas', title: 'Saída das Costas', description: 'Defesa do pescoço, Escolha do lado, Saída de Ponte.', tips: [], videoUrl: '' },
          { id: 'bjj-blue-costas-3', category: 'Costas', title: 'Ataques das Costas', description: 'Pescoço (2), Ataque braço, Arco e flecha.', tips: [], videoUrl: '' },
        ]
      },
      {
        id: 'bjj-purple',
        name: 'Faixa Roxa',
        color: 'bg-purple-600',
        description: 'Refinamento de movimento e combinações.',
        progress: 0,
        techniques: []
      },
      {
        id: 'bjj-brown',
        name: 'Faixa Marrom',
        color: 'bg-[#5d4037]',
        description: 'Eficiência máxima e ataques de perna.',
        progress: 0,
        techniques: []
      },
      {
        id: 'bjj-black',
        name: 'Faixa Preta',
        color: 'bg-black',
        description: 'Maestria e adaptação.',
        progress: 0,
        techniques: []
      }
    ]
  },
  {
    id: 'wrestling',
    name: 'Wrestling',
    iconType: 'wrestling',
    instructor: 'Coach Snap',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDYUcXzaWYihDtfWHdjio1n_Em4mtSjSdMr2w-z0Mv47rvWQ_YuwCV_EPcacJuoAkO1DQKtFyOvctCQuDlxMOtojTOP0YWeUM4ImAegKvTcWupwtok85Tt3ZtgG5pKkkR9DwzU4ijljuZQ_HXjEsRujEWBuWxacXmxA6FQp7FXhGx3liS3xOStfRBqsi1he5ziNOBjE2yeyyWQ-tZJCT3kKANu-oH4FM_EfAC9rDPsz03S3-mpvexDLeqQ966xfsjxYw-nzsxRyA',
    description: 'A arte da queda e do controle posicional.',
    levels: [
      {
        id: 'w-beg',
        name: 'Iniciante',
        color: 'bg-green-600',
        description: 'Postura, movimentação e quedas básicas.',
        progress: 20,
        techniques: [
          { 
            id: 't-w-beg-1', 
            title: 'Stance & Motion', 
            category: 'Fundamentos',
            description: 'Postura base e movimentação sem cruzar os pés.', 
            tips: ['Mantenha os joelhos flexionados.', 'Cabeça levantada sempre.'],
            videoUrl: 'https://www.youtube.com/results?search_query=wrestling+stance+and+motion+tutorial'
          },
          { 
            id: 't-w-beg-2', 
            title: 'Double Leg (Baiana)', 
            category: 'Quedas',
            description: 'Entrada nas duas pernas com postura correta.', 
            tips: ['Mude de nível antes de entrar.', 'Cabeça na costela, não na barriga.'],
            videoUrl: 'https://www.youtube.com/results?search_query=wrestling+double+leg+takedown+tutorial'
          }
        ]
      },
      {
        id: 'w-int',
        name: 'Intermediário',
        color: 'bg-yellow-600',
        description: 'Defesa de quedas e ataques de perna única.',
        progress: 0,
        techniques: [
          { 
            id: 't-w-int-1', 
            title: 'Sprawl e Go Behind', 
            category: 'Defesa',
            description: 'Defesa de entrada de pernas e pegada de costas.', 
            tips: ['Quadril no chão rápido.', 'Pese em cima da cabeça do oponente.'],
            videoUrl: 'https://www.youtube.com/results?search_query=wrestling+sprawl+technique'
          },
          { 
            id: 't-w-int-2', 
            title: 'Single Leg High Crotch', 
            category: 'Quedas',
            description: 'Entrada em uma perna com cabeça por fora.', 
            tips: ['Cotovelo fechado.', 'Gire a esquina (turn the corner).'],
            videoUrl: 'https://www.youtube.com/results?search_query=wrestling+high+crotch+single+leg'
          }
        ]
      },
      {
        id: 'w-adv',
        name: 'Avançado',
        color: 'bg-red-700',
        description: 'Projeções de alta amplitude e cadeias de ataque.',
        progress: 0,
        techniques: [
          { 
            id: 't-w-adv-1', 
            title: 'Suplex', 
            category: 'Projeções',
            description: 'Projeção de grande amplitude pelas costas.', 
            tips: ['Explosão de quadril.', 'Arqueie as costas com segurança.'],
            videoUrl: 'https://www.youtube.com/results?search_query=greco+roman+suplex+tutorial'
          },
          { 
            id: 't-w-adv-2', 
            title: 'Ankle Pick', 
            category: 'Quedas',
            description: 'Queda técnica baixando o nível do oponente.', 
            tips: ['Force a cabeça dele para o joelho.', 'Timing é tudo.'],
            videoUrl: 'https://www.youtube.com/results?search_query=wrestling+ankle+pick+tutorial'
          }
        ]
      }
    ]
  },
  {
    id: 'muaythai',
    name: 'Muay Thai',
    iconType: 'boxing',
    instructor: 'Kru Thai',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4DEhAAHe18yP47P8tfXEcbcff9PXRucLiqlYwWnVe9Q1H90dZiijhVuo072Rcek5ZxAxeDz5hIe3WMf4cGwiW_znXe7kHzEVtZWWMsg342OoilgK8PIdk8jheP1LIurpkqpVR111mHS9HE7x9SVPqkPUPlIM-Owx6gigciQAs5wZXc9e9l6oLqGwvVdMvBfqTHeGLXQFylciO_qCa1otPYt8p2yF0IFf-c65hhTv37h80oAsXvJnQkJV-ehe3MnLCBHSVAM1KpA',
    description: 'A arte das oito armas.',
    levels: [
      {
        id: 'mt-beg',
        name: 'Iniciante',
        color: 'bg-red-600',
        description: 'Jab, direto, chute base e teep.',
        progress: 30,
        techniques: [
          { 
            id: 't-mt-beg-1', 
            title: 'Jab & Direto', 
            category: 'Striking',
            description: 'Golpes retos básicos.', 
            tips: ['Gire o quadril no direto.', 'Mão oposta protege o queixo.'],
            videoUrl: 'https://www.youtube.com/results?search_query=muay+thai+jab+cross+tutorial'
          },
          { 
            id: 't-mt-beg-2', 
            title: 'Teep (Frontal)', 
            category: 'Striking',
            description: 'Chute frontal para controle de distância.', 
            tips: ['Use a sola do pé (metatarso).', 'Incline o corpo levemente para trás.'],
            videoUrl: 'https://www.youtube.com/results?search_query=muay+thai+teep+technique'
          }
        ]
      },
      {
        id: 'mt-int',
        name: 'Intermediário',
        color: 'bg-blue-600',
        description: 'Clinch, joelhadas e defesas de chute.',
        progress: 0,
        techniques: [
          { 
            id: 't-mt-int-1', 
            title: 'Clinch Tailandês (Plum)', 
            category: 'Clinch',
            description: 'Controle da cabeça e postura no clinch.', 
            tips: ['Cotovelos fechados no peito do oponente.', 'Quebre a postura dele.'],
            videoUrl: 'https://www.youtube.com/results?search_query=muay+thai+clinch+basics'
          },
          { 
            id: 't-mt-int-2', 
            title: 'Bloqueio de Chute (Check)', 
            category: 'Defesa',
            description: 'Defesa de chute circular usando a canela.', 
            tips: ['Joelho vai ao cotovelo.', 'Ponta do pé para cima.'],
            videoUrl: 'https://www.youtube.com/results?search_query=muay+thai+checking+kicks'
          },
          { 
            id: 't-mt-int-3', 
            title: 'Joelhada Direta', 
            category: 'Striking',
            description: 'Joelhada frontal penetrante.', 
            tips: ['Projete o quadril para frente.', 'Puxe o oponente para o golpe.'],
            videoUrl: 'https://www.youtube.com/results?search_query=muay+thai+knee+technique'
          }
        ]
      },
      {
        id: 'mt-adv',
        name: 'Avançado',
        color: 'bg-black',
        description: 'Cotoveladas, giros e estratégia de combate.',
        progress: 0,
        techniques: [
          { 
            id: 't-mt-adv-1', 
            title: 'Cotovelada Giratória', 
            category: 'Striking',
            description: 'Golpe surpresa girando sobre o eixo.', 
            tips: ['Olhe antes de bater.', 'Gire rápido e recupere a base.'],
            videoUrl: 'https://www.youtube.com/results?search_query=muay+thai+spinning+elbow'
          },
          { 
            id: 't-mt-adv-2', 
            title: 'Banda (Sweep) do Clinch', 
            category: 'Quedas',
            description: 'Derrubar o oponente usando o desequilíbrio no clinch.', 
            tips: ['Chute a perna de apoio quando ele se mover.', 'Gire o tronco dele.'],
            videoUrl: 'https://www.youtube.com/results?search_query=muay+thai+clinch+sweeps'
          }
        ]
      }
    ]
  }
];