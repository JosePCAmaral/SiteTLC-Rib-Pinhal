// =====================================================================
//  CONTEÚDO DO SITE — TLC Ribeirão do Pinhal
// ---------------------------------------------------------------------
//  Este é o ÚNICO arquivo que você precisa editar no dia a dia.
//  Regras simples:
//   • Textos ficam sempre entre aspas: "assim".
//   • Cada item de uma lista termina com vírgula.
//   • Deixe "" (aspas vazias) ou [] (lista vazia) para esconder algo.
//   • Fotos: coloque o arquivo na pasta  public/fotos/  e escreva aqui
//     só "fotos/nome-do-arquivo.jpg".
//  Guia completo: COMO-EDITAR.md
// =====================================================================

const conteudo = {
  // ---------------- Informações gerais ----------------
  nome: "TLC Ribeirão do Pinhal",
  nomeCurto: "TLC",
  slogan: "Jovens que se encontram com Cristo e saem para servir.",
  logo: "", // ex: "fotos/logo.png" — vazio usa o nome escrito
  paroquia: "Paróquia Santuário do Divino Espírito Santo",
  diocese: "Diocese de Jacarezinho",
  cidade: "Ribeirão do Pinhal – PR",
  fraseDoMovimento: "Tudo está previsto!",

  // ---------------- Contato ----------------
  instagram: "tlc_ribeiraodopinhal", // só o @, sem o símbolo
  whatsapp: "", // ex: "5543999999999" — vazio esconde o botão
  email: "",
  linkInscricao: "https://forms.gle/G9T4gEBjQtBDMsu79",

  // ---------------- Próximo evento (contagem regressiva) ----------------
  proximoEvento: {
    nome: "Noite Mariana",
    chamada: "Uma noite com Maria, aberta a toda a comunidade.",
    descricao:
      "Nosso primeiro encontro! Uma noite de oração, louvor e partilha aos pés de Nossa Senhora. Traga sua família, seus amigos e venha conhecer o TLC Ribeirão do Pinhal.",
    // Formato: ANO-MÊS-DIATHORA:MINUTO:00-03:00  (o -03:00 é o horário de Brasília)
    data: "2026-12-11T19:30:00-03:00",
    local: "Salão Paroquial do Santuário Divino Espírito Santo",
    cidade: "Ribeirão do Pinhal – PR",
    publico: "Aberto a toda a comunidade",
    linkInscricao: "", // vazio = usa o link de inscrição geral acima
  },

  // ---------------- Quem somos (página inicial) ----------------
  quemSomos: [
    "Somos um grupo de jovens da Paróquia Santuário do Divino Espírito Santo, em Ribeirão do Pinhal, que decidiu trazer o TLC — Treinamento de Liderança Cristã — para a nossa cidade.",
    "Acreditamos que todo jovem tem um lugar na Igreja e uma missão no mundo. Queremos ser uma comunidade onde a fé é vivida com alegria, amizade e serviço.",
    "Estamos só começando — e você pode começar com a gente.",
  ],

  // ---------------- Página "O que é o TLC" ----------------
  oQueETLC: {
    introducao: [
      "O TLC (Treinamento de Liderança Cristã) é um movimento da Igreja Católica voltado aos jovens. Foi fundado no Brasil pelo Padre Haroldo Rahm, jesuíta, e hoje está presente em muitas dioceses do país.",
      "O coração do TLC é o encontro: um fim de semana em que jovens vivem uma experiência profunda com Deus, servidos por outros jovens que já passaram pelo mesmo caminho. Depois do encontro, a caminhada continua em grupo, com formação, amizade e serviço na paróquia.",
    ],
    pilares: [
      { titulo: "Encontro", texto: "Uma experiência pessoal com Cristo que muda o jeito de olhar a vida." },
      { titulo: "Comunidade", texto: "Amizades verdadeiras, construídas na fé e na partilha." },
      { titulo: "Liderança", texto: "Jovens que aprendem a servir e a assumir sua missão na Igreja." },
      { titulo: "Serviço", texto: "Fé que vira ação na paróquia e na cidade." },
    ],
  },

  // ---------------- Perguntas sobre o encontro ----------------
  // Deixe a resposta vazia ("") para aparecer "Tudo está previsto!" 😉
  perguntas: [
    { pergunta: "Quem pode participar do TLC?", resposta: "Jovens que desejam conhecer mais a Deus e viver a fé em comunidade. Fique de olho no nosso Instagram para saber as idades e datas de cada encontro." },
    { pergunta: "O que acontece no encontro?", resposta: "" },
    { pergunta: "Vou ficar sem celular?", resposta: "" },
    { pergunta: "Onde a gente dorme e o que vamos comer?", resposta: "" },
    { pergunta: "Precisa pagar?", resposta: "Cada encontro tem sua taxa, divulgada junto com as inscrições. Ninguém deixa de participar por falta de condição — fale com a gente." },
  ],

  // ---------------- Agenda de eventos ----------------
  // Eventos com data passada vão automaticamente para "Já aconteceu".
  eventos: [
    {
      nome: "Noite Mariana",
      data: "2026-12-11T19:30:00-03:00",
      local: "Salão Paroquial do Santuário Divino Espírito Santo",
      descricao: "Nosso primeiro encontro, aberto a toda a comunidade.",
    },
  ],

  // ---------------- Fotos ----------------
  // Aparecem no carrossel da página inicial e na Galeria, nesta ordem.
  // Coloque o arquivo em public/fotos/ (nome sem espaço nem acento).
  fotos: [
    { arquivo: "fotos/implantacao-tlc-paroquia.jpg", legenda: "Dia da apresentação e implantação do TLC na Paróquia Santuário do Divino Espírito Santo" },
    { arquivo: "fotos/encontro-depois-da-missa.jpg", legenda: "Encontro depois da missa" },
    { arquivo: "fotos/planejamento-primeiro-tlc-diocese.jpg", legenda: "Encontro de planejamento do primeiro TLC da Diocese de Jacarezinho" },
    { arquivo: "fotos/entrega-primeiro-tlc-diocesano.jpg", legenda: "Entrega do primeiro TLC diocesano" },
    { arquivo: "fotos/participantes-primeiro-tlc-diocese.jpg", legenda: "Participantes do primeiro TLC da Diocese de Jacarezinho" },
    { arquivo: "fotos/pe-haroldo-rahm.jpg", legenda: "Pe. Haroldo Rahm, fundador do TLC" },
    { arquivo: "fotos/aniversario-pe-haroldo-rahm.jpg", legenda: "Aniversário do Pe. Haroldo Rahm" },
  ],

  // ---------------- Depoimentos ----------------
  depoimentos: [
    // { nome: "Ana, 17 anos", texto: "Foi a noite mais bonita do meu ano!" },
  ],

  // ---------------- Instituições de apoio ----------------
  // logo: coloque a imagem em public/apoiadores/ (opcional)
  // instagram: só o @, sem o símbolo  |  site: endereço completo, com https://
  // Deixe "" para esconder o ícone.
  apoiadores: [
    {
      nome: "Paróquia Santuário do Divino Espírito Santo",
      logo: "apoiadores/paroquia-divino-espirito-santo.svg",
      instagram: "santdespiritosanto", 
      site: "",
    },
    {
      nome: "Diocese de Jacarezinho",
      logo: "apoiadores/diocese-jacarezinho.webp",
      instagram: "diocesedejacarezinho",
      site: "https://diocesejacarezinho.org",
    },
  ],

  // ---------------- Doações ----------------
  doacoes: {
    texto:
      "O TLC é feito por voluntários. Cada doação ajuda a realizar encontros, comprar materiais e acolher jovens que não teriam condição de participar.",
    pix: {
      chave: "", // vazio mostra "em breve"
      tipo: "", // ex: "CNPJ", "E-mail", "Celular"
      favorecido: "",
    },
    outrasFormas: [
      { titulo: "Alimentos", texto: "Doações de alimentos para os lanches e refeições dos encontros." },
      { titulo: "Materiais", texto: "Papelaria, decoração e itens para as atividades." },
      { titulo: "Oração", texto: "Reze pelos jovens e pelas equipes. É a doação mais importante!" },
    ],
  },
};

export default conteudo;
