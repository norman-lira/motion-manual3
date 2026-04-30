import { useState, useEffect, useMemo, useRef } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Todos",
  "After Effects",
  "Expressões",
  "Efeitos Visuais",
  "Texto Animado",
  "Transições",
  "Loops",
  "Partículas",
  "Direção de Arte",
  "IA / Prompts",
];

const LEVELS = ["básico", "intermediário", "avançado"];

const CAT_ICONS = {
  "After Effects": "⚡",
  "Expressões": "{ }",
  "Efeitos Visuais": "✦",
  "Texto Animado": "T",
  "Transições": "⇌",
  "Loops": "∞",
  "Partículas": "·:·",
  "Direção de Arte": "◈",
  "IA / Prompts": "◎",
};

const CAT_COLORS = {
  "After Effects": "#2962FF",
  "Expressões": "#7C3AED",
  "Efeitos Visuais": "#0891B2",
  "Texto Animado": "#DB2777",
  "Transições": "#059669",
  "Loops": "#D97706",
  "Partículas": "#4F46E5",
  "Direção de Arte": "#BE185D",
  "IA / Prompts": "#0EA5E9",
};

const LEVEL_STYLES = {
  básico:        { bg: "rgba(74,222,128,0.08)", text: "#4ade80", border: "rgba(74,222,128,0.25)" },
  intermediário: { bg: "rgba(250,204,21,0.08)", text: "#facc15", border: "rgba(250,204,21,0.25)" },
  avançado:      { bg: "rgba(248,113,113,0.08)", text: "#f87171", border: "rgba(248,113,113,0.25)" },
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_DATA = [
  {
    id: "1",
    name: "Loop Infinito com Offset",
    aka: "Cycle Loop, Loop Expression",
    category: "Loops",
    level: "básico",
    purpose: "Repetir uma animação indefinidamente sem precisar copiar keyframes manualmente. Ideal para criar ciclos contínuos de movimento, rotação ou qualquer propriedade animada.",
    howTo: "1. Crie sua animação com pelo menos 2 keyframes.\n2. Na propriedade animada, segure Alt e clique no ícone de cronômetro.\n3. No campo de expressão que aparecer, digite: loopOut('cycle')\n4. Pressione Enter. A animação irá repetir infinitamente.",
    effects: "Nenhum efeito adicional necessário. Funciona com qualquer propriedade animável.",
    expression: "loopOut('cycle')",
    keywords: ["loop", "ciclo", "repetição", "infinito", "offset", "cycle"],
    example: "Logotipo girando continuamente em um vídeo de identidade de marca, ou fundo animado em loop para stories de Instagram de produto.",
  },
  {
    id: "2",
    name: "Texto com Entrada Rápida",
    aka: "Text Animator, Fast In, Slam Down, Kinetic Type",
    category: "Texto Animado",
    level: "básico",
    purpose: "Animar letras ou palavras com entrada dinâmica e impactante, criando ritmo visual forte. Muito usada em motion para redes sociais e peças de alta energia.",
    howTo: "1. Crie uma camada de texto.\n2. Vá em Animate > Position (ou Scale).\n3. Adicione um Range Selector.\n4. Configure o Start: 0% e End: 100% animados.\n5. Ajuste Ease High e Ease Low para 75% para suavidade.\n6. No Range Selector > Advanced, defina Based On: Characters.",
    effects: "Text Animator nativo do After Effects. Ative Motion Blur na timeline para resultado mais profissional.",
    expression: "",
    keywords: ["texto", "entrada", "animação", "letters", "redes sociais", "impacto", "kinetic", "type"],
    example: "Título de campanha publicitária com cada palavra 'caindo' na tela em sequência, criando ritmo de leitura na peça.",
  },
  {
    id: "3",
    name: "Wiggle Orgânico",
    aka: "Wiggle Expression, Camera Shake, Organic Movement, Jitter",
    category: "Expressões",
    level: "intermediário",
    purpose: "Gerar movimento orgânico e aleatório em qualquer propriedade, simulando vibração, câmera na mão ou textura de vida. Elimina a rigidez de animações mecânicas.",
    howTo: "1. Selecione a camada e expanda a propriedade desejada (Position, Rotation, Scale).\n2. Segure Alt e clique no cronômetro da propriedade.\n3. Digite a expressão wiggle(freq, amp) onde freq = oscilações por segundo e amp = intensidade.\n4. Para wiggle suave: wiggle(2, 8). Para shake intenso: wiggle(10, 30).",
    effects: "Nenhum efeito necessário. Para intensificar, combine com Motion Blur.",
    expression: "wiggle(3, 15)",
    keywords: ["wiggle", "tremor", "orgânico", "aleatorio", "camera shake", "vida", "jitter", "shake"],
    example: "Câmera tremendo sutilmente em cena de ação publicitária, ou produto flutuando levemente em anúncio de e-commerce premium.",
  },
  {
    id: "4",
    name: "Partículas de Atmosfera",
    aka: "Particle System, Dust, Bokeh Background, Floating Particles",
    category: "Partículas",
    level: "intermediário",
    purpose: "Criar poeira, faíscas, bokeh ou partículas flutuantes que adicionam profundidade e atmosfera à cena, transformando um fundo simples em ambiente rico.",
    howTo: "1. Crie uma solid preta > Effect > Simulation > CC Particle World.\n2. Ajuste Birth Rate para 0.3 e Longevity para 3.0.\n3. No Producer, ajuste Radius X/Y/Z para definir área de emissão.\n4. Em Physics, configure Gravity para -0.1 (partículas sobem).\n5. Em Particle, escolha Faded Sphere e ajuste Birth/Death Size.\n6. Mude o modo da camada para Screen.",
    effects: "CC Particle World. Adicione Fast Blur (Bokeh Effect: On) para suavizar. Glow para brilho.",
    expression: "",
    keywords: ["partículas", "poeira", "bokeh", "atmosfera", "profundidade", "glitter", "dust", "sparkle"],
    example: "Poeira dourada flutuando sobre produto de luxo em anúncio premium de perfume, ou neve em campanha de Natal.",
  },
  {
    id: "5",
    name: "Repeater para Padrões Infinitos",
    aka: "Shape Repeater, Pattern Generator, Infinite Grid, Tessellation",
    category: "After Effects",
    level: "intermediário",
    purpose: "Criar padrões geométricos repetidos a partir de uma única forma, gerando fundos complexos e animados com facilidade e leveza no projeto.",
    howTo: "1. Crie uma Shape Layer com uma forma básica (círculo, quadrado, linha).\n2. No painel Contents, clique em Add > Repeater.\n3. Configure Copies para o número de repetições desejadas.\n4. Em Transform do Repeater, ajuste Position para espaçar as cópias.\n5. Para grades 2D, adicione um segundo Repeater com Position em ângulo 90°.\n6. Anime o Rotation ou Position do Repeater para animar todo o padrão.",
    effects: "Shape Layer com Repeater nativo. Combine com Trim Paths para efeito de construção animada.",
    expression: "",
    keywords: ["repeater", "padrão", "grid", "geométrico", "fundo", "formas", "infinito", "pattern"],
    example: "Fundo geométrico animado para vinheta de programa de TV ou identidade visual de marca tech.",
  },
  {
    id: "6",
    name: "Turbulent Displace",
    aka: "Warp, Liquid, Organic Distortion, Heat Distortion",
    category: "Efeitos Visuais",
    level: "intermediário",
    purpose: "Distorcer imagens, texto ou formas de maneira fluida e orgânica, simulando calor, líquido, energia ou interferência. Cria a sensação de movimento vivo e dinâmico.",
    howTo: "1. Aplique Effect > Distort > Turbulent Displace na camada.\n2. Ajuste Amount (intensidade) e Size (tamanho das ondas).\n3. Para animar continuamente, Alt+clique em Evolution e insira: time * 80\n4. Para calor: Amount 25, Size 80. Para líquido: Amount 60, Size 30.\n5. Reduza a opacidade ou use blend mode para integrar.",
    effects: "Turbulent Displace. Combine com Glow para efeito energético ou com Fast Blur para calor realista.",
    expression: "time * 80",
    keywords: ["turbulence", "distorção", "orgânico", "liquid", "calor", "warp", "energia", "heat"],
    example: "Logotipo se dissolvendo em chamas em intro de produto, ou texto com efeito de calor para campanha de verão.",
  },
  {
    id: "7",
    name: "Set Matte / Track Matte",
    aka: "Alpha Matte, Luma Matte, Reveal Mask",
    category: "After Effects",
    level: "intermediário",
    purpose: "Usar uma camada como máscara para revelar ou ocultar outra camada, criando recortes não-destrutivos e transições elegantes baseadas em formas ou luminância.",
    howTo: "1. Empilhe as camadas: Matte acima, Conteúdo abaixo.\n2. Na camada de conteúdo, acesse TrkMat na timeline.\n3. Escolha Alpha Matte (usa transparência) ou Luma Matte (usa brilho).\n4. A camada de matte ficará invisível e controlará a visibilidade do conteúdo.\n5. Para animar a revelação, anime uma forma no matte (ex: retângulo crescendo).",
    effects: "Track Matte nativo. Combine com formas animadas ou CC Particle World para mattes dinâmicos.",
    expression: "",
    keywords: ["matte", "mascara", "alpha", "recorte", "track matte", "reveal", "transição", "luma"],
    example: "Texto revelando paisagem ao fundo em abertura de campanha de viagem, ou produto surgindo através de um logotipo.",
  },
  {
    id: "8",
    name: "CC Bend It para Balanço",
    aka: "Bend, Flex, Wobble, Plant Sway",
    category: "Efeitos Visuais",
    level: "básico",
    purpose: "Dobrar ou curvar uma camada plana como se fosse flexível, criando balanço, flexão ou curvatura convincente sem precisar de puppet pins ou bones.",
    howTo: "1. Selecione a camada (imagem, shape ou pre-comp).\n2. Aplique Effect > Distort > CC Bend It.\n3. Defina o ponto Start na base do objeto e End no topo.\n4. Anime o parâmetro Bend de -30 a +30 para criar balanço.\n5. Use Easy Ease nos keyframes para movimento orgânico.",
    effects: "CC Bend It. Para resultado mais suave, aumente a qualidade da camada para Best.",
    expression: "wiggle(2, 20)",
    keywords: ["bend", "balanço", "curva", "flexivel", "onda", "wobble", "elastico", "planta"],
    example: "Planta ou árvore balançando ao vento em comercial de produtos naturais, ou antena vibrando em cena de tech.",
  },
  {
    id: "9",
    name: "Mosaic para Pixel Art",
    aka: "Pixelate, Mosaic Effect, Glitch Pixel, 8-bit Look",
    category: "Efeitos Visuais",
    level: "básico",
    purpose: "Pixelizar uma imagem ou vídeo, criando estética retrô 8-bit, transições de pixelização ou efeito de glitch digital. Muito versátil para transições criativas.",
    howTo: "1. Aplique Effect > Stylize > Mosaic na camada.\n2. Ajuste Horizontal Blocks e Vertical Blocks (quanto menor, mais pixelado).\n3. Para transição de entrada: anime de 4 blocos para 200 blocos durante 20 frames.\n4. Para glitch: varie os blocos aleatoriamente usando expressão: Math.round(random(4, 80))\n5. Combine com Posterize Time (Effect > Time) para look 8-bit completo.",
    effects: "Mosaic + Posterize Time para glitch completo. Adicione Hue/Saturation para saturar as cores.",
    expression: "Math.round(random(4, 80))",
    keywords: ["pixel", "mosaic", "pixelado", "retro", "glitch", "8bit", "digital", "game"],
    example: "Imagem de produto se formando pixel a pixel para anúncio de produto tech ou game, ou transição pixelada entre cenas.",
  },
  {
    id: "10",
    name: "Find Edges para Visual de Contorno",
    aka: "Edge Detection, Outline Effect, Sketch Look, Drawing Style",
    category: "Direção de Arte",
    level: "básico",
    purpose: "Converter qualquer imagem ou vídeo em visual de contornos, criando estética de esboço, animação em outline ou visual gráfico de alto contraste.",
    howTo: "1. Aplique Effect > Stylize > Find Edges na camada de vídeo ou imagem.\n2. Ative a opção Invert para contornos escuros em fundo branco.\n3. Ajuste a opacidade para misturar com o original se quiser.\n4. Adicione Hue/Saturation para colorir as bordas detectadas.\n5. Combine com uma camada de fundo colorida para resultado editorial.",
    effects: "Find Edges. Adicione Hue/Saturation para colorir e Curves para ajustar contraste das bordas.",
    expression: "",
    keywords: ["find edges", "contorno", "outline", "esboço", "sketch", "borda", "artistico", "drawing"],
    example: "Cena live-action se transformando em animação de contorno para peça publicitária criativa de marca de arte ou moda.",
  },
];

// ─── Small Components ─────────────────────────────────────────────────────────

function LevelBadge({ level }) {
  const s = LEVEL_STYLES[level] || LEVEL_STYLES["básico"];
  return (
    <span style={{
      background: s.bg, color: s.text,
      border: `1px solid ${s.border}`,
      borderRadius: 4, padding: "2px 10px",
      fontSize: 11, fontWeight: 700,
      textTransform: "uppercase", letterSpacing: 1,
    }}>
      {level}
    </span>
  );
}

function CatBadge({ cat }) {
  const color = CAT_COLORS[cat] || "#2962FF";
  return (
    <span style={{
      background: color + "18", color: color,
      border: `1px solid ${color}40`,
      borderRadius: 4, padding: "2px 10px",
      fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    }}>
      {CAT_ICONS[cat] || "·"} {cat}
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ item, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item) return null;
  const color = CAT_COLORS[item.category] || "#2962FF";

  const sections = [
    { label: "Para que serve", value: item.purpose },
    { label: "Como fazer no After Effects", value: item.howTo },
    { label: "Efeitos usados", value: item.effects },
    item.expression ? { label: "Expressão", value: item.expression, isCode: true } : null,
    { label: "Exemplo em vídeo publicitário", value: item.example },
  ].filter(Boolean);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.80)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0b0e18",
          border: `1px solid ${color}40`,
          borderTop: `3px solid ${color}`,
          borderRadius: 16,
          maxWidth: 700, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          padding: "32px 36px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ flex: 1, paddingRight: 16 }}>
            <h2 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>{item.name}</h2>
            {item.aka && (
              <p style={{ color: "#475569", fontSize: 13, margin: "6px 0 0", fontStyle: "italic" }}>
                Também conhecido como: {item.aka}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#1e2235", border: "none",
              borderRadius: 8, padding: "8px 12px",
              color: "#64748b", cursor: "pointer", fontSize: 16,
              lineHeight: 1, flexShrink: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#2a2f4a"}
            onMouseLeave={e => e.currentTarget.style.background = "#1e2235"}
          >
            ✕
          </button>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          <CatBadge cat={item.category} />
          <LevelBadge level={item.level} />
        </div>

        {/* Sections */}
        {sections.map(({ label, value, isCode }) => (
          <div key={label} style={{ marginBottom: 24 }}>
            <p style={{
              color: color, fontSize: 10, fontWeight: 800,
              textTransform: "uppercase", letterSpacing: 2,
              margin: "0 0 8px",
            }}>
              {label}
            </p>
            {isCode ? (
              <pre style={{
                background: "#070a10",
                border: `1px solid ${color}30`,
                borderRadius: 8,
                padding: "14px 18px",
                color: "#a5f3fc",
                fontSize: 14,
                fontFamily: "'DM Mono', 'Fira Code', monospace",
                overflowX: "auto",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}>
                {value}
              </pre>
            ) : (
              <p style={{
                color: "#cbd5e1", fontSize: 14,
                lineHeight: 1.8, margin: 0,
                whiteSpace: "pre-line",
              }}>
                {value}
              </p>
            )}
          </div>
        ))}

        {/* Keywords */}
        {item.keywords?.length > 0 && (
          <div>
            <p style={{ color: color, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 10px" }}>
              Palavras-chave
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {item.keywords.map((k) => (
                <span
                  key={k}
                  style={{
                    background: "#1e2235", color: "#64748b",
                    borderRadius: 4, padding: "4px 10px",
                    fontSize: 12, fontWeight: 500,
                  }}
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Edit / Add Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "", aka: "",
  category: "After Effects",
  level: "básico",
  purpose: "", howTo: "",
  effects: "", expression: "",
  keywords: "", example: "",
};

function EditModal({ item, onClose, onSave }) {
  const isNew = !item;
  const [form, setForm] = useState(() =>
    item
      ? { ...item, keywords: Array.isArray(item.keywords) ? item.keywords.join(", ") : (item.keywords || "") }
      : { ...EMPTY_FORM }
  );

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (!form.name.trim()) { alert("Nome é obrigatório."); return; }
    const keywords = typeof form.keywords === "string"
      ? form.keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : form.keywords || [];
    onSave({ ...form, keywords, id: form.id || String(Date.now()) });
  };

  const inputStyle = {
    width: "100%", background: "#070a10",
    border: "1px solid #1e2235", borderRadius: 8,
    padding: "10px 14px", color: "#e2e8f0",
    fontSize: 14, outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.15s",
  };
  const labelStyle = {
    color: "#475569", fontSize: 11, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: 1.2,
    display: "block", marginBottom: 6,
  };

  const fields = [
    { key: "purpose", label: "Para que serve", rows: 2 },
    { key: "howTo", label: "Como fazer no After Effects", rows: 4 },
    { key: "effects", label: "Efeitos usados", rows: 2 },
    { key: "expression", label: "Expressão (se houver)", rows: 1 },
    { key: "keywords", label: "Palavras-chave (separadas por vírgula)", rows: 1 },
    { key: "example", label: "Exemplo em vídeo publicitário", rows: 3 },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0b0e18",
          border: "1px solid #1e2235",
          borderTop: "3px solid #2962FF",
          borderRadius: 16, maxWidth: 660, width: "100%",
          maxHeight: "92vh", overflowY: "auto",
          padding: "32px 36px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>
            {isNew ? "✦ Novo item" : "✏️ Editar item"}
          </h2>
          <button onClick={onClose} style={{ background: "#1e2235", border: "none", borderRadius: 8, padding: "6px 12px", color: "#64748b", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Row 1: name full width */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Nome *</label>
          <input value={form.name} onChange={set("name")} style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#2962FF"}
            onBlur={e => e.target.style.borderColor = "#1e2235"}
            placeholder="Ex: Bounce Elástico com Expressão" />
        </div>

        {/* Row 2: aka full width */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Também conhecido como</label>
          <input value={form.aka} onChange={set("aka")} style={inputStyle}
            onFocus={e => e.target.style.borderColor = "#2962FF"}
            onBlur={e => e.target.style.borderColor = "#1e2235"}
            placeholder="Ex: Elastic Easing, Spring Animation" />
        </div>

        {/* Row 3: category + level */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Categoria</label>
            <select value={form.category} onChange={set("category")} style={{ ...inputStyle, cursor: "pointer" }}>
              {CATEGORIES.filter((c) => c !== "Todos").map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nível</label>
            <select value={form.level} onChange={set("level")} style={{ ...inputStyle, cursor: "pointer" }}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Textarea fields */}
        {fields.map(({ key, label, rows }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{label}</label>
            <textarea
              value={form[key]} onChange={set(key)} rows={rows}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = "#2962FF"}
              onBlur={e => e.target.style.borderColor = "#1e2235"}
            />
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 22px", borderRadius: 8,
              border: "1px solid #1e2235", background: "none",
              color: "#64748b", cursor: "pointer", fontSize: 14, fontWeight: 600,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 28px", borderRadius: 8,
              border: "none", background: "#2962FF",
              color: "#fff", cursor: "pointer",
              fontSize: 14, fontWeight: 700,
              boxShadow: "0 0 20px rgba(41,98,255,0.35)",
            }}
          >
            {isNew ? "Adicionar" : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ item, onClick, onEdit, onDelete }) {
  const color = CAT_COLORS[item.category] || "#2962FF";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#0f1420" : "#0b0e18",
        border: `1px solid ${hovered ? color + "50" : "#1e2235"}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12, padding: 20,
        cursor: "pointer", position: "relative",
        transition: "all 0.18s",
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            color: hovered ? "#fff" : "#f1f5f9",
            fontSize: 15, fontWeight: 700,
            margin: 0, lineHeight: 1.4,
            transition: "color 0.15s",
          }}>
            {item.name}
          </h3>
          {item.aka && (
            <p style={{ color: "#475569", fontSize: 11, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {item.aka}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(item)}
            title="Editar"
            style={{
              background: "#1e2235", border: "none", borderRadius: 6,
              padding: "5px 8px", cursor: "pointer",
              color: "#64748b", fontSize: 13,
              transition: "all 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#2a2f4a"; e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1e2235"; e.currentTarget.style.color = "#64748b"; }}
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item.id)}
            title="Excluir"
            style={{
              background: "#1e2235", border: "none", borderRadius: 6,
              padding: "5px 8px", cursor: "pointer",
              color: "#64748b", fontSize: 13,
              transition: "all 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1e2235"; e.currentTarget.style.color = "#64748b"; }}
          >
            🗑
          </button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <CatBadge cat={item.category} />
        <LevelBadge level={item.level} />
      </div>

      {/* Purpose */}
      <p style={{
        color: "#94a3b8", fontSize: 13, lineHeight: 1.7,
        margin: 0, flex: 1,
        display: "-webkit-box", WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {item.purpose}
      </p>

      {/* Expression */}
      {item.expression && (
        <code style={{
          display: "block",
          background: "#070a10",
          border: `1px solid ${color}25`,
          borderRadius: 6, padding: "6px 12px",
          color: "#a5f3fc", fontSize: 12,
          fontFamily: "'DM Mono', monospace",
          overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {item.expression}
        </code>
      )}

      {/* Keywords */}
      {item.keywords?.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {item.keywords.slice(0, 4).map((k) => (
            <span key={k} style={{ background: "#1e2235", color: "#475569", borderRadius: 4, padding: "2px 7px", fontSize: 11 }}>
              #{k}
            </span>
          ))}
          {item.keywords.length > 4 && (
            <span style={{ color: "#334155", fontSize: 11, padding: "2px 4px" }}>+{item.keywords.length - 4}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("motionlib_v2");
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const searchRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem("motionlib_v2", JSON.stringify(items)); } catch {}
  }, [items]);

  // Cmd/Ctrl+K to focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return items.filter((item) => {
      const catMatch = category === "Todos" || item.category === category;
      const lvlMatch = levelFilter === "Todos" || item.level === levelFilter;
      if (!q) return catMatch && lvlMatch;
      const blob = [
        item.name, item.aka, item.purpose, item.howTo,
        item.effects, item.expression, item.example,
        ...(item.keywords || []),
      ].join(" ").toLowerCase();
      return catMatch && lvlMatch && blob.includes(q);
    });
  }, [items, search, category, levelFilter]);

  const counts = useMemo(() => {
    const c = {};
    CATEGORIES.forEach((cat) => {
      c[cat] = cat === "Todos" ? items.length : items.filter((i) => i.category === cat).length;
    });
    return c;
  }, [items]);

  const handleSave = (item) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item];
    });
    setEditing(null);
    setAddingNew(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Remover este item da biblioteca?")) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const resetData = () => {
    if (window.confirm("Restaurar todos os dados originais? Isso irá apagar seus itens personalizados.")) {
      setItems(INITIAL_DATA);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070a10", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>

      {/* ── Header ── */}
      <header style={{
        background: "#0a0d14",
        borderBottom: "1px solid #1e2235",
        padding: "0 20px",
        height: 60,
        display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 0 #1e2235",
      }}>
        {/* Logo + toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          title="Alternar sidebar"
          style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", padding: 4, fontSize: 18, lineHeight: 1, flexShrink: 0 }}
        >
          ☰
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: "linear-gradient(135deg, #2962FF, #5b8aff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(41,98,255,0.4)",
          }}>
            <span style={{ fontSize: 13, color: "#fff" }}>▶</span>
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: 15, color: "#fff", letterSpacing: -0.5, display: "block", lineHeight: 1 }}>Motion Library</span>
            <span style={{ fontSize: 10, color: "#334155", letterSpacing: 0.5 }}>by motion designers</span>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 540, margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#334155", fontSize: 15, pointerEvents: "none" }}>
            ⌕
          </span>
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar técnica, efeito, expressão… (⌘K)"
            style={{
              width: "100%", background: "#0f1117",
              border: "1px solid #1e2235",
              borderRadius: 10, padding: "9px 40px 9px 40px",
              color: "#e2e8f0", fontSize: 14, outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = "#2962FF"}
            onBlur={e => e.target.style.borderColor = "#1e2235"}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#475569",
                cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Add button */}
        <button
          onClick={() => setAddingNew(true)}
          style={{
            background: "#2962FF", border: "none", borderRadius: 8,
            padding: "8px 18px", color: "#fff", cursor: "pointer",
            fontSize: 14, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
            boxShadow: "0 0 16px rgba(41,98,255,0.3)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1a4fcc"; e.currentTarget.style.boxShadow = "0 0 24px rgba(41,98,255,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#2962FF"; e.currentTarget.style.boxShadow = "0 0 16px rgba(41,98,255,0.3)"; }}
        >
          <span style={{ fontSize: 20, lineHeight: 0.8 }}>+</span> Novo
        </button>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside style={{
            width: 230, background: "#0a0d14",
            borderRight: "1px solid #1e2235",
            padding: "16px 10px 24px",
            flexShrink: 0,
            position: "sticky", top: 60,
            height: "calc(100vh - 60px)",
            overflowY: "auto",
            display: "flex", flexDirection: "column",
          }}>
            {/* Categories */}
            <p style={{ color: "#334155", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, padding: "0 10px", margin: "0 0 8px" }}>
              Categorias
            </p>
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              const color = cat === "Todos" ? "#2962FF" : CAT_COLORS[cat] || "#2962FF";
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    width: "100%", display: "flex",
                    justifyContent: "space-between", alignItems: "center",
                    background: active ? `${color}18` : "transparent",
                    border: active ? `1px solid ${color}35` : "1px solid transparent",
                    borderRadius: 8, padding: "7px 10px",
                    cursor: "pointer", color: active ? color : "#475569",
                    fontSize: 13, fontWeight: active ? 700 : 400,
                    marginBottom: 1, textAlign: "left",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#1e2235"; e.currentTarget.style.color = "#94a3b8"; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; } }}
                >
                  <span>{cat === "Todos" ? "✦ " : `${CAT_ICONS[cat] || "·"} `}{cat}</span>
                  <span style={{
                    background: active ? `${color}25` : "#1e2235",
                    color: active ? color : "#334155",
                    borderRadius: 4, padding: "1px 7px",
                    fontSize: 11, fontWeight: 700, minWidth: 20, textAlign: "center",
                  }}>
                    {counts[cat]}
                  </span>
                </button>
              );
            })}

            {/* Level filter */}
            <p style={{ color: "#334155", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, padding: "0 10px", margin: "20px 0 8px" }}>
              Nível
            </p>
            {["Todos", ...LEVELS].map((l) => {
              const active = levelFilter === l;
              const lc = l === "Todos" ? null : LEVEL_STYLES[l];
              return (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", gap: 8,
                    background: active ? (lc ? lc.bg : "#1e2235") : "transparent",
                    border: active ? `1px solid ${lc ? lc.border : "#2962FF35"}` : "1px solid transparent",
                    borderRadius: 8, padding: "7px 10px",
                    cursor: "pointer",
                    color: active ? (lc ? lc.text : "#fff") : "#475569",
                    fontSize: 13, fontWeight: active ? 700 : 400,
                    marginBottom: 1, textAlign: "left",
                    transition: "all 0.12s",
                  }}
                >
                  {lc && (
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: lc.text, display: "inline-block", flexShrink: 0 }} />
                  )}
                  {l === "Todos" ? "Todos os níveis" : l.charAt(0).toUpperCase() + l.slice(1)}
                </button>
              );
            })}

            {/* Reset */}
            <div style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid #1e2235", marginLeft: 2, marginRight: 2 }}>
              <button
                onClick={resetData}
                style={{
                  width: "100%", background: "none",
                  border: "1px solid #1e2235", borderRadius: 8,
                  padding: "8px 10px", color: "#334155",
                  cursor: "pointer", fontSize: 11,
                  fontWeight: 600, textAlign: "center",
                  transition: "all 0.12s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#f8717140"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2235"; e.currentTarget.style.color = "#334155"; }}
              >
                ↺ Restaurar dados originais
              </button>
            </div>
          </aside>
        )}

        {/* ── Main Content ── */}
        <main style={{ flex: 1, padding: 28, minWidth: 0 }}>
          {/* Toolbar row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
                {category === "Todos" ? "Todos os efeitos" : `${CAT_ICONS[category] || ""} ${category}`}
              </h1>
              <p style={{ color: "#475569", fontSize: 13, margin: "3px 0 0" }}>
                {filtered.length} {filtered.length === 1 ? "item encontrado" : "itens encontrados"}
                {search && <span style={{ color: "#334155" }}> para "{search}"</span>}
              </p>
            </div>
            {/* Active filters */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {search && (
                <button onClick={() => setSearch("")} style={{ background: "#1e2235", border: "none", borderRadius: 6, padding: "6px 12px", color: "#94a3b8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  ✕ "{search}"
                </button>
              )}
              {category !== "Todos" && (
                <button onClick={() => setCategory("Todos")} style={{ background: "#1e2235", border: "none", borderRadius: 6, padding: "6px 12px", color: "#94a3b8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  ✕ {category}
                </button>
              )}
              {levelFilter !== "Todos" && (
                <button onClick={() => setLevelFilter("Todos")} style={{ background: "#1e2235", border: "none", borderRadius: 6, padding: "6px 12px", color: "#94a3b8", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  ✕ {levelFilter}
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>◎</div>
              <p style={{ color: "#475569", fontSize: 18, fontWeight: 600 }}>Nenhum resultado encontrado</p>
              <p style={{ color: "#334155", fontSize: 14, marginTop: 8 }}>Tente outra palavra-chave ou adicione um novo item à biblioteca.</p>
              <button
                onClick={() => setAddingNew(true)}
                style={{
                  marginTop: 20, background: "#2962FF", border: "none",
                  borderRadius: 8, padding: "10px 24px",
                  color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
                }}
              >
                + Adicionar novo item
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}>
              {filtered.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  onClick={() => setSelected(item)}
                  onEdit={() => setEditing(item)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Modals ── */}
      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
      {(addingNew || editing) && (
        <EditModal
          item={editing}
          onClose={() => { setEditing(null); setAddingNew(false); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
