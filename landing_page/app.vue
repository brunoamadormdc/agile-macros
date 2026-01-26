<template>
  <div class="landing-page">
    <!-- Header -->
    <header class="header">
      <div class="container header-content">
        <div class="logo">
          <img src="~/assets/logo.png" alt="Agile Macros" class="logo-img" />

          <span class="badge">BETA</span>
        </div>
        <nav class="nav">
          <a href="#problem">O Problema</a>
          <a href="#solution">A Solução</a>
          <a href="#pricing">Planos</a>
          <a href="#faq">FAQ</a>
          <a href="http://localhost:5173/" class="btn small success">Acessar App</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <div class="scarcity-tag">🔒 Vagas Limitadas para o Beta</div>
          <h1>A Dieta do Shape, <br><span class="gradient-text">Sem a Planilha Chata.</span></h1>
          <p class="lead">
            Controle seus macros por Inteligência Artificial em segundos e foque no único número que importa:
            <strong>seu saldo semanal</strong>.
          </p>
          <div class="hero-cta">
            <a href="http://localhost:5173/plans" class="btn primary big pulse">Quero meu Acesso + 10 Créditos
              Grátis</a>
            <p class="crypto-text">⚡ Nenhuma fidelidade necessária. Cancele quando quiser.</p>
          </div>
          <div class="social-proof">

            <p>+500 usuários na lista de espera essa semana.</p>
          </div>
        </div>
        <div class="hero-visual">
          <!-- ... existing mockup ... -->
          <div class="app-card-mockup tilt">
            <div class="mockup-screen">
              <div class="screen-header">
                <span>Hoje</span>
                <span class="status green">No Foco</span>
              </div>
              <div class="ai-input-sim">
                <div class="input-fake">"2 ovos e 1 tapioca..."</div>
                <div class="btn-fake">IA</div>
              </div>
              <div class="food-list-fake">
                <div class="food-item-fake">
                  <div class="bar-fake" style="width: 80%"></div>
                  <span>Ovos Cozidos (2un)</span>
                </div>
                <div class="food-item-fake">
                  <div class="bar-fake" style="width: 100%"></div>
                  <span>Tapioca (100g)</span>
                </div>
              </div>
              <div class="week-summary-fake">
                <p>Saldo da Semana</p>
                <h3>+120 kcal <small>(Compensável)</small></h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Problem Section (Agitation) -->
    <section id="problem" class="section dark-alt">
      <div class="container">
        <div class="section-header">
          <h2>Por que você desiste da dieta na 2ª semana?</h2>
          <p>Não é falta de força de vontade. É falta de ferramenta certa.</p>
        </div>
        <div class="grid-3">
          <div class="card-problem">
            <div class="emoji">😫</div>
            <h3>O Tédio de Registrar</h3>
            <p>Pesquisar "frango grelhado" 5x por dia em apps lentos e cheios de anúncios mata sua paciência.</p>
          </div>
          <div class="card-problem">
            <div class="emoji">📉</div>
            <h3>A Culpa do "Dia do Lixo"</h3>
            <p>Comeu uma pizza no sábado e o app ficou vermelho te julgando? Você desanima e larga tudo.</p>
          </div>
          <div class="card-problem">
            <div class="emoji">🥴</div>
            <h3>Tabelas Gringas</h3>
            <p>Tentar achar "Pão Francês" e só encontrar "French Baguette" ou alimentos que não existem no Brasil.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution Section -->
    <section id="solution" class="section">
      <div class="container">
        <div class="split-layout reverse-mobile">
          <div class="text-content">
            <span class="eyebrow">A SOLUÇÃO AGILE MACROS</span>
            <h2>Nós automatizamos a parte chata.</h2>
            <ul class="check-list">
              <li>
                <strong>📸 IA Vision & Texto:</strong> Não digite. Apenas tire uma foto ou fale "Arroz, feijão e bife".
                Nossa IA entende e registra.
              </li>
              <li>
                <strong>📅 Metodologia de Saldo Semanal:</strong> Exagerou na terça? O app dilui o excesso no resto da
                semana. O jogo é longo prazo.
              </li>
              <li>
                <strong>🇧🇷 Base TACO Integrada:</strong> Mais de 14.000 alimentos reais da culinária brasileira.
              </li>
            </ul>
            <a href="http://localhost:5173/plans" class="btn primary">Experimentar Agora</a>
          </div>
          <div class="visual-content centered">
            <div class="circle-graphic">
              <div class="circle-inner">
                <span>IA</span>
                <small>Worker</small>
              </div>
              <div class="orbit-item i1">🌮</div>
              <div class="orbit-item i2">🥪</div>
              <div class="orbit-item i3">🍗</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works / Deep Dive -->
    <section class="section dark-alt">
      <div class="container">
        <div class="section-header">
          <h2>Como Funciona</h2>
        </div>
        <div class="steps-grid">
          <div class="step-card">
            <span class="step-num">1</span>
            <h4>Defina sua Meta</h4>
            <p>Cutting, Bulking ou Manutenção. Nossa calculadora científica define o alvo.</p>
          </div>
          <div class="step-card">
            <span class="step-num">2</span>
            <h4>Registre Rápido</h4>
            <p>Use a IA para adicionar refeições em segundos. O sistema aprende seus hábitos.</p>
          </div>
          <div class="step-card">
            <span class="step-num">3</span>
            <h4>Acompanhe as Bolinhas</h4>
            <p>Mantenha as bolinhas da semana verdes. Se uma ficar vermelha, ajuste as próximas.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h3>Por que o Agile Macros?</h3>
          <p>Esqueça os apps genéricos. Focamos no que importa para quem treina.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="icon">🧠</div>
            <h4>IA Que Aprende</h4>
            <p>Não achou o alimento? Tire uma foto ou descreva. Nossa IA calcula os macros e aprende para a próxima vez.
            </p>
          </div>
          <div class="feature-card">
            <div class="icon">📊</div>
            <h4>Foco no Saldo Semanal</h4>
            <p>Um dia ruim não estraga seu shape. Visualize seu saldo semanal e compense nos próximos dias sem neura.
            </p>
          </div>
          <div class="feature-card">
            <div class="icon">🇧🇷</div>
            <h4>Base TACO Brasileira</h4>
            <p>Mais de 14.000 alimentos da nossa culinária. De arroz com feijão a açaí, tudo calculado na base 100g.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🎯</div>
            <h4>Estratégia Automática</h4>
            <p>Cutting, Bulking ou Manutenção? O app define suas metas baseado no seu objetivo atual.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Copy Feature Highlight -->
    <section class="section">
      <div class="container">
        <div class="split-layout">
          <div class="visual-content centered">
            <img src="~/assets/drinkwater.png" alt="Ganhe Tempo" class="feature-img-highlight" />
          </div>
          <div class="text-content">
            <span class="eyebrow">NOVIDADE</span>
            <h2>Come o mesmo todo dia? Ganhe tempo.</h2>
            <p class="lead">Não perca vida registrando café da manhã repetido.</p>
            <p>Com a nova função <strong>Smart Copy</strong>, você duplica refeições inteiras ou copia o dia anterior
              com um único clique.</p>
            <ul class="check-list">
              <li><strong>🚀 Copiar Dia:</strong> Repita o sucesso de ontem hoje.</li>
              <li><strong>📝 Duplicar Item:</strong> Ajuste apenas a quantidade.</li>
              <li><strong>⚡ Zero Atrito:</strong> Menos toques, mais foco no treino.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Voice Feature Highlight -->
    <section class="section dark-alt">
      <div class="container">
        <div class="split-layout reverse-mobile">
          <div class="text-content">
            <span class="eyebrow">DIRETO AO PONTO</span>
            <h2>Preguiça de Digitar? <br>Apenas Fale.</h2>
            <p class="lead">Tecnologia <strong>Voice-to-Log</strong> para quem não tem tempo a perder.</p>
            <p>Ative o microfone e diga "Omelete de 3 ovos e suco de laranja". A IA entende, calcula os macros e
              registra.</p>
            <ul class="check-list">
              <li><strong>🎙️ Reconhecimento Instantâneo:</strong> Entende quantidades e unidades.</li>
              <li><strong>🏎️ O Método Mais Rápido:</strong> De 0 a registrado em 5 segundos.</li>
            </ul>
          </div>
          <div class="visual-content centered">
            <img src="~/assets/eating.png" alt="Comando de Voz" class="feature-img-highlight" />
          </div>
        </div>
      </div>
    </section>

    <!-- Eating Without Fear Section -->
    <section class="section">
      <div class="container">
        <div class="split-layout">
          <div class="visual-content centered">
            <img src="~/assets/eating_without_fear.png" alt="Comer sem culpa" class="feature-img-highlight" />
          </div>
          <div class="text-content">
            <span class="eyebrow">LIBERDADE NUTRICIONAL</span>
            <h2>Coma o que ama.<br>Sem culpa.</h2>
            <p class="lead">O Fim do "Dia do Lixo". Bem-vindo ao equilíbro.</p>
            <p>Esqueça o terrorismo nutricional. Com o <strong>Saldo Semanal</strong>, se você comer uma pizza no
              sábado, o app recalcula seus dias restantes automaticamente.</p>
            <ul class="check-list">
              <li><strong>🍕 Liberdade Real:</strong> Encaixe alimentos "proibidos" na sua meta.</li>
              <li><strong>📉 Compensação Inteligente:</strong> Exagerou? O app dilui o excesso na semana.</li>
              <li><strong>😊 Zero Neura:</strong> Sua dieta se adapta à sua vida social, não o contrário.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- PWA / App Freedom Section -->
    <section class="section dark-alt">
      <div class="container">
        <div class="section-header">
          <h2>Seu App, Suas Regras.</h2>
          <p>Sem downloads pesados. Sem lojas de aplicativo.</p>
        </div>

        <div class="pwa-showcase">
          <div class="pwa-card">
            <div class="pwa-icon">📲</div>
            <h3>Instale Direto do Navegador</h3>
            <p>O Agile Macros é um <strong>Web App (PWA)</strong>. Adicione à tela inicial do seu Android ou iPhone com
              um clique e use como um app nativo.</p>
          </div>
          <div class="pwa-card">
            <div class="pwa-icon">💻</div>
            <h3>Use no Computador</h3>
            <p>Prefere registrar no trabalho? Acesse pelo PC, Mac ou Linux. Seus dados sincronizam em tempo real em
              todos os dispositivos.</p>
          </div>
          <div class="pwa-card">
            <div class="pwa-icon">🚀</div>
            <h3>Leve e Rápido</h3>
            <p>Não ocupa gigas de espaço no seu celular. Atualizações instantâneas sem precisar baixar versões novas.
            </p>
          </div>
        </div>

        <div class="pwa-cta">
          <p>Acesse agora mesmo:</p>
          <a href="http://localhost:5173" class="btn primary big">Abrir Web App Agora</a>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
      <div class="container">
        <div class="section-header">
          <h2>Planos Flexíveis</h2>
          <p>Comece pequeno ou jogue grande.</p>
        </div>
        <div class="pricing-grid">
          <!-- Free Plan -->
          <div class="pricing-card">
            <h3>Plano Grátis</h3>
            <div class="price">R$ 0 <span>/mês</span></div>
            <ul class="benefits">
              <li>✅ Diário Manual Ilimitado</li>
              <li>✅ <strong>20 Créditos IA</strong> (Degustação)</li>
              <li>✅ Saldo Semanal</li>
            </ul>
            <a href="http://localhost:5173/plans" class="btn secondary full">Começar Grátis</a>
          </div>

          <!-- Plus Plan -->
          <div class="pricing-card focus">
            <div class="card-tag">Recomendado</div>
            <h3>Plus (Ilimitado)</h3>
            <div class="price">R$ 59,90 <span>/mês</span></div>
            <ul class="benefits">
              <li>✅ <strong>IA ILIMITADA</strong> 🔥</li>
              <li>✅ Histórico Infinito</li>
              <li>✅ Evolução Avançada</li>
              <li>✅ Suporte Prioritário</li>
            </ul>
            <a href="http://localhost:5173/plans" class="btn primary full">Garantir Plus</a>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="section">
      <div class="container narrow">
        <div class="section-header">
          <h2>Perguntas Frequentes</h2>
        </div>
        <div class="faq-list">
          <details class="faq-item">
            <summary>O aplicativo é gratuito?</summary>
            <p>Sim! Temos um plano Free vitalício que te dá acesso ao controle manual ilimitado e 10 créditos de IA para
              testar a mágica.</p>
          </details>
          <details class="faq-item">
            <summary>A IA acerta as quantidades?</summary>
            <p>A IA estima médias padronizadas. Você pode sempre ajustar a quantidade exata (gramas) antes de confirmar,
              garantindo precisão total.</p>
          </details>
          <details class="faq-item">
            <summary>Serve para dieta Low Carb / Cetogênica?</summary>
            <p>Com certeza. O App Counter foca nos números. Você define a estratégia, nós ajudamos a contar.</p>
          </details>
          <details class="faq-item">
            <summary>Os dados são meus?</summary>
            <p>Sim. Seus dados são privados e não são vendidos para terceiros.</p>
          </details>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="cta-section">
      <div class="container text-center">
        <h2>Pare de adiar o corpo que você merece.</h2>
        <p>Junte-se a centenas de usuários que estão assumindo o controle hoje.</p>
        <br>
        <a href="http://localhost:5173/plans" class="btn primary huge pulse">Criar Conta Grátis</a>
        <p class="small-print">Sem cartão de crédito necessário para começar.</p>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 App Counter. Construído para quem treina de verdade.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useHead } from '#imports'

useHead({
  title: 'App Counter - A Revolução do Diário Nutricional',
  meta: [
    { name: 'description', content: 'Controle sua dieta com IA, saldo semanal e base TACO. O app definitivo para quem busca o shape.' },
    { name: 'theme-color', content: '#0f172a' }
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  }
})
</script>

<style>
/* CSS Reset & Variables */
:root {
  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --primary: #f59e0b;
  /* Amber 500 */
  --primary-hover: #d97706;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
  --success: #10b981;
  --font-sans: 'Inter', system-ui, sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: var(--bg-dark);
  color: var(--text-main);
  line-height: 1.6;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

a {
  text-decoration: none;
  color: inherit;
  transition: 0.2s;
}

/* Components */
.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
}

.btn.primary {
  background: var(--primary);
  color: white;
}

.btn.primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}

.btn.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
}

.btn.small:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn.full {
  width: 100%;
}

.badge {
  background: var(--primary);
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  vertical-align: middle;
  margin-left: 8px;
}

.badge.success {
  background: var(--success);
}

/* Header */
.header {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  height: 40px;
  width: auto;
}

.logo h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.nav {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav a:not(.btn) {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.nav a:not(.btn):hover {
  color: var(--text-main);
}

/* Hero */
.hero {
  padding: 6rem 0;
  overflow: hidden;
  position: relative;
}

.scarcity-tag {
  background: rgba(245, 158, 11, 0.15);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  display: inline-block;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.hero-text .lead {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.gradient-text {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.crypto-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-proof {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.avatars {
  display: flex;
  background: var(--bg-card);
  padding: 4px 12px;
  border-radius: 99px;
  border: 1px solid var(--border);
  gap: 6px;
  font-size: 1.2rem;
}

.social-proof p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

.app-card-mockup.tilt {
  transform: perspective(800px) rotateY(-5deg) rotateX(2deg);
  transition: transform 0.5s;
}

.app-card-mockup.tilt:hover {
  transform: perspective(800px) rotateY(0) rotateX(0);
}

.mockup-screen {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.screen-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
}

.status.green {
  color: var(--success);
  font-size: 0.8rem;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 99px;
}

.ai-input-sim {
  background: var(--bg-dark);
  padding: 8px;
  border-radius: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 0.5rem;
}

.input-fake {
  font-size: 0.8rem;
  color: var(--text-muted);
  flex: 1;
  font-style: italic;
}

.btn-fake {
  background: var(--primary);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: grid;
  place-items: center;
  font-size: 0.6rem;
  font-weight: bold;
  color: white;
}

.food-list-fake {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.food-item-fake {
  position: relative;
  padding: 8px 0;
  font-size: 0.9rem;
}

.bar-fake {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--success);
  opacity: 0.5;
}

.week-summary-fake {
  background: rgba(16, 185, 129, 0.05);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px dashed var(--success);
}

.week-summary-fake p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  text-transform: uppercase;
}

.week-summary-fake h3 {
  font-size: 1.5rem;
  margin: 4px 0 0;
  color: var(--success);
}

.week-summary-fake small {
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: 400;
  color: var(--text-muted);
}

/* Problem Section */
.section {
  padding: 6rem 0;
}

.section.dark-alt {
  background: linear-gradient(180deg, var(--bg-dark), #162033);
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.card-problem {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: 0.3s;
}

.card-problem:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
}

.card-problem .emoji {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.card-problem h3 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.card-problem p {
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

/* Features */
.features {
  padding: 8rem 0;
  background-color: #0f172a;
  background-image: radial-gradient(at 50% 0%, #1e293b 0%, #0f172a 70%);
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 5rem;
}

.section-header h3 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.section-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.feature-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(10px);
  padding: 2.5rem 1.5rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(30, 41, 59, 0.6);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
}

.feature-card .icon {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.1);
  transition: 0.3s;
}

.feature-card:hover .icon {
  transform: scale(1.1);
  background: rgba(245, 158, 11, 0.2);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.2);
}

.feature-card h4 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.feature-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.6;
}

/* Solution */
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.text-content .eyebrow {
  color: var(--success);
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: block;
}

.text-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  line-height: 1.2;
}

.check-list {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.check-list li {
  margin-bottom: 1.5rem;
  padding-left: 20px;
  border-left: 2px solid var(--primary);
  padding-left: 1.5rem;
  color: var(--text-muted);
}

.check-list strong {
  color: var(--text-main);
  display: block;
  margin-bottom: 4px;
  font-size: 1.1rem;
}

.visual-content.centered {
  display: flex;
  justify-content: center;
}

.circle-graphic {
  width: 300px;
  height: 300px;
  border: 1px dashed var(--border);
  border-radius: 50%;
  position: relative;
  display: grid;
  place-items: center;
  animation: spin-slow 20s linear infinite;
}

.circle-inner {
  position: absolute;
  background: var(--bg-card);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--primary);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.2);
  animation: counter-spin 20s linear infinite;
}

.circle-inner span {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
}

.orbit-item {
  position: absolute;
  font-size: 2rem;
}

.orbit-item.i1 {
  top: -20px;
  left: 50%;
}

.orbit-item.i2 {
  bottom: 20px;
  right: -10px;
}

.orbit-item.i3 {
  bottom: 20px;
  left: -10px;
}

@keyframes spin-slow {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes counter-spin {
  100% {
    transform: rotate(-360deg);
  }
}

/* How it Works */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
}

.step-card {
  background: transparent;
  border: 1px solid var(--border);
  padding: 2rem;
  border-radius: 12px;
  position: relative;
  text-align: center;
}

.step-num {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-dark);
  color: var(--primary);
  font-size: 2.5rem;
  font-weight: 800;
  padding: 0 10px;
  line-height: 1;
}

.step-card h4 {
  margin-top: 1rem;
  font-size: 1.25rem;
}

/* FAQ */
.narrow {
  max-width: 800px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: var(--bg-card);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.faq-item summary {
  padding: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
  position: relative;
}

.faq-item[open] summary {
  border-bottom: 1px solid var(--border);
  color: var(--primary);
}

.faq-item p {
  padding: 1.5rem;
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
}

/* CTA Section / Pricing */
.cta-section {
  padding: 6rem 0;
  background: radial-gradient(circle at center, #1e293b 0%, var(--bg-dark) 70%);
}

.huge {
  font-size: 1.25rem;
  padding: 1rem 3rem;
}

.small-print {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 1rem;
  opacity: 0.7;
}

/* Pricing Card (Reused) */
.pricing-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 3rem;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.pricing-card.focus {
  border-color: var(--primary);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
}

/* Animation Pulse */
.pulse {
  animation: pulse-btn 2s infinite;
}

@keyframes pulse-btn {
  0% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-grid,
  .grid-3,
  .steps-grid,
  .split-layout {
    grid-template-columns: 1fr;
  }

  .hero-text h1 {
    font-size: 2.5rem;
    text-align: center;
  }

  .hero-text .lead {
    text-align: center;
    margin: 0 auto 2rem;
  }

  .hero-cta {
    flex-direction: column;
    text-align: center;
  }

  .reverse-mobile {
    display: flex;
    flex-direction: column-reverse;
  }
}

/* Social Proof Avatars */
.avatars img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--bg-card);
  object-fit: cover;
}

/* Results Section */
.results-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (min-width: 768px) {
  .results-grid {
    grid-template-columns: repeat(1, 1fr);
    max-width: 900px;
    /* Optional: Constrain slightly if they get too big, or remove to fill full container */
    margin-left: auto;
    margin-right: auto;
  }
}

.result-card img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: transform 0.3s;
  aspect-ratio: 4/4;
  object-fit: cover;
}

.result-card:hover img {
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* Pricing Grid */
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (min-width: 900px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
    /* Reduced for 2 cards */
    align-items: center;
  }
}

.pricing-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pricing-card h3 {
  margin: 0 0 1rem;
  color: var(--text-main);
}

.pricing-card .price {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--text-main);
}

.pricing-card .price span {
  font-size: 1rem;
  color: var(--text-muted);
}

.pricing-card.focus {
  border-color: var(--primary);
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.15);
  transform: scale(1.05);
  z-index: 2;
  background: linear-gradient(to bottom, #1e293b, #0f172a);
}

.card-tag {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: white;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 0 0 8px 8px;
}

.benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  text-align: left;
}

.benefits li {
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.btn.secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-main);
}

.btn.secondary:hover {
  border-color: var(--text-main);
  background: rgba(255, 255, 255, 0.05);
}

.feature-img-highlight {
  max-width: 100%;
  max-height: 400px;
  border-radius: 16px;
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }

  100% {
    transform: translateY(0px);
  }
}

.pwa-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.pwa-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s;
}

.pwa-card:hover {
  border-color: var(--success);
  transform: translateY(-5px);
}

.pwa-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: rgba(16, 185, 129, 0.1);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
}

.pwa-card h3 {
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.pwa-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.pwa-cta {
  text-align: center;
  margin-top: 3rem;
}

.pwa-cta p {
  color: var(--text-muted);
  margin-bottom: 1rem;
}
</style>
