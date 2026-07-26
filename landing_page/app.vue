<template>
    <div class="landing-page">
        <!-- Header -->
        <header class="header">
            <div class="container header-content">
                <div class="logo">
                    <img src="~/assets/logo_hor_white.png" alt="MacroWeek" class="logo-img" />
                </div>
                <nav class="nav">
                    <a href="#concept">O Conceito</a>
                    <a href="#concept">Como funciona</a>
                    <a href="#faq">Dúvidas</a>
                    <a :href="appUrl" class="btn small primary">Acessar App</a>
                </nav>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="hero text-center">
            <div class="container narrow">
                <div class="scarcity-pill">🔒 Vagas Limitadas para o Beta</div>
                <h1 class="hero-title">
                    Tenha o Corpo que Você Quer.<br>
                    <span class="gradient-text">Sem a Culpa de um Dia Ruim.</span>
                </h1>
                <p class="hero-lead">
                    O primeiro app de nutrição focado no seu <strong>Saldo Semanal</strong>.
                    Exagerou no churrasco? Nós ajustamos sua meta para o resto da semana. Sem neura.
                </p>

                <div class="hero-ctas">
                    <a :href="`${appUrl}/register`" class="btn primary big pulse">Começar Agora (Grátis)</a>
                    <p class="microcopy">⚡ Sem cartão de crédito. Leva 30 segundos.</p>
                </div>

                <div class="hero-visual-card">
                    <div class="weekly-balance-mockup">
                        <div class="wb-header">
                            <span>Seu Saldo Semanal</span>
                            <span class="badge success">No Foco</span>
                        </div>
                        <div class="wb-graph">
                            <div class="day-col manual active">
                                <div class="bar over" style="height: 120%"></div>
                                <span>SEG</span>
                            </div>
                            <div class="day-col">
                                <div class="bar" style="height: 90%"></div>
                                <span>TER</span>
                            </div>
                            <div class="day-col">
                                <div class="bar" style="height: 95%"></div>
                                <span>QUA</span>
                            </div>
                            <div class="day-col">
                                <div class="bar" style="height: 100%"></div>
                                <span>QUI</span>
                            </div>
                            <div class="day-col">
                                <div class="bar" style="height: 100%"></div>
                                <span>SEX</span>
                            </div>
                        </div>
                        <div class="wb-message">
                            <span>⚠️ Você passou 200kcal na Segunda.</span>
                            <strong>Ajustamos -50kcal/dia no resto da semana pra você. 😉</strong>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Problem Section -->
        <section class="section dark-alt">
            <div class="container">
                <div class="section-header">
                    <h2>Por que você desiste na 2ª semana?</h2>
                    <p>O problema não é você. É a ferramenta errada.</p>
                </div>
                <div class="grid-3">
                    <div class="card-problem">
                        <div class="emoji">😫</div>
                        <h3>O Tédio de Registrar</h3>
                        <p>Digitar "100g de arroz" todo dia cansa. Apps lentos matam sua constância.</p>
                    </div>
                    <div class="card-problem">
                        <div class="emoji">📉</div>
                        <h3>A Culpa do "Dia do Lixo"</h3>
                        <p>Comeu uma pizza e o app ficou vermelho? Você desanima, chuta o balde e desiste.</p>
                    </div>
                    <div class="card-problem">
                        <div class="emoji">🤖</div>
                        <h3>Apps Burros</h3>
                        <p>Eles não entendem que sua vida muda. A meta fixa diária é uma armadilha para falhar.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Concept Section (The Game Changer) -->
        <section id="concept" class="section">
            <div class="container">
                <div class="split-layout">
                    <div class="text-content">
                        <span class="eyebrow">A LÓGICA DO MACROWEEK</span>
                        <h2>O Jogo é Semanal,<br>não Diário.</h2>
                        <ul class="concept-list">
                            <li>
                                <strong>🔄 A vida não é linear:</strong> Tem dias que você tem mais fome, tem dias que
                                tem festa. Tudo bem.
                            </li>
                            <li>
                                <strong>⚖️ Compensação Automática:</strong> Se você comer mais hoje, o app dilui esse
                                excesso levemente nos próximos dias.
                            </li>
                            <li>
                                <strong>🎯 Foco no Longo Prazo:</strong> O único número que importa é a média da semana.
                            </li>
                        </ul>
                        <div class="quote-box">
                            "Um dia ruim não estraga seu shape. Uma semana ruim, talvez."
                        </div>
                    </div>
                    <div class="visual-content centered">
                        <img src="~/assets/eating_without_fear.png" alt="Comer sem Medo"
                            class="feature-img-highlight" />
                    </div>
                </div>

                <!-- Second Concept Block with Drink Water Image -->
                <div class="split-layout reverse" style="margin-top: 5rem;">
                    <div class="visual-content centered">
                        <img src="~/assets/drinkwater.png" alt="Constância" class="feature-img-highlight" />
                    </div>
                    <div class="text-content">
                        <h2>Constância > Perfeição</h2>
                        <p class="lead">Pare de recomeçar do zero.</p>
                        <p>A maioria das pessoas desiste porque tenta ser perfeita. O MacroWeek te permite ser
                            <strong>humano</strong>. Errou? O app recalcula. Bebeu? O app ajusta. O importante é não
                            parar.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works Section -->
        <section class="section dark-alt">
            <div class="container">
                <div class="section-header">
                    <h2>Como Funciona</h2>
                    <p>Simples. Rápido. Sem burocracia.</p>
                </div>
                <div class="steps-row">
                    <div class="step-item">
                        <div class="step-num">1</div>
                        <h4>Defina sua Meta</h4>
                        <p>Cutting, Bulking ou Manutenção. Nossa calculadora científica te dá o alvo inicial.</p>
                    </div>
                    <div class="step-item">
                        <div class="step-num">2</div>
                        <h4>Registre em 5s</h4>
                        <p>Registre suas refeições manualmente ou copie um dia anterior para ganhar tempo.</p>
                    </div>
                    <div class="step-item">
                        <div class="step-num">3</div>
                        <h4>Siga o Saldo</h4>
                        <p>Mantenha o saldo semanal verde. Se errar um dia, apenas siga a nova sugestão do app.</p>
                    </div>
                </div>
                <div class="center-cta">
                    <a :href="`${appUrl}/register`" class="btn primary big">Começar agora</a>
                </div>
            </div>
        </section>

        <!-- Proof / Trust Checklist -->
        <section class="section">
            <div class="container narrow">
                <div class="trust-box">
                    <h3>O que você ganha nos primeiros 2 minutos:</h3>
                    <ul class="check-grid">
                        <li>✅ Cálculo de TMB e GET preciso</li>
                        <li>✅ Definição de Macros (Prot/Carb/Gord)</li>
                        <li>✅ Registro manual ilimitado</li>
                        <li>✅ Acesso à base TACO Brasileira</li>
                        <li>✅ Zero necessidade de Cartão de Crédito</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="section dark-alt">
            <div class="container narrow">
                <div class="section-header">
                    <h2>Perguntas Frequentes</h2>
                    <p>Tirando suas dúvidas antes de começar.</p>
                </div>
                <div class="faq-list">
                    <details class="faq-item">
                        <summary>Preciso pesar minha comida?</summary>
                        <p>Para ter resultado máximo, sim. Você também pode registrar medidas caseiras, como
                            colheres e xícaras.</p>
                    </details>
                    <details class="faq-item">
                        <summary>E se eu comer besteira (dia do lixo)?</summary>
                        <p>Registre a besteira. O app vai mostrar quanto isso impactou seu saldo semanal e sugerir como
                            compensar (ex: 50kcal a menos por dia).</p>
                    </details>
                    <details class="faq-item">
                        <summary>Funciona para Cutting e Bulking?</summary>
                        <p>Sim. Você define o objetivo e o app ajusta a matemática do saldo semanal para garantir que
                            você esteja em déficit ou superávit.</p>
                    </details>
                    <details class="faq-item">
                        <summary>Tem alimentos brasileiros?</summary>
                        <p>Sim! Usamos a tabela TACO e outros bancos BR. Arroz, feijão, pão francês, cuscuz... tudo
                            nativo.</p>
                    </details>
                    <details class="faq-item">
                        <summary>Como cancela?</summary>
                        <p>Com 1 clique no seu perfil. Sem ligar pra ninguém, sem chat chato.</p>
                    </details>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer-cta">
            <div class="container text-center">
                <h2>Pare de começar do zero toda segunda-feira.</h2>
                <p>Assuma o controle do seu saldo semanal hoje.</p>
                <br>
                <a :href="`${appUrl}/register`" class="btn primary huge pulse">Criar Minha Conta</a>
                <p class="footer-copy">&copy; 2026 MacroWeek. Feito para quem treina.</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { useHead, useRuntimeConfig } from '#imports'

const { public: { appUrl } } = useRuntimeConfig()

useHead({
    title: 'MacroWeek - Saldo Semanal Inteligente',
    meta: [
        { name: 'description', content: 'Pare de desistir da dieta. O MacroWeek ajusta sua meta automaticamente quando você exagera.' },
        { name: 'theme-color', content: '#0f172a' }
    ],
    htmlAttrs: {
        lang: 'pt-BR'
    }
})
</script>

<style>
/* Reset & Base */
:root {
    --bg-dark: #0f172a;
    --bg-card: #1e293b;
    --primary: #f59e0b;
    --primary-hover: #d97706;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: #334155;
    --success: #10b981;
    --danger: #ef4444;
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
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

.container.narrow {
    max-width: 800px;
}

a {
    text-decoration: none;
    color: inherit;
    transition: 0.2s;
}

/* Buttons */
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
    transition: all 0.2s;
}

.btn.primary {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.4);
}

.btn.primary:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -2px rgba(245, 158, 11, 0.5);
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

.btn.small {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

.btn.big {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

.btn.huge {
    padding: 1.25rem 2.5rem;
    font-size: 1.25rem;
    font-weight: 800;
}

.btn.full {
    width: 100%;
}

.pulse {
    animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
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

/* Header */
.header {
    padding: 1.5rem 0;
    position: sticky;
    top: 0;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(12px);
    z-index: 100;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-img {
    height: 60px;
    width: auto;
}

/* adjusted height */

.nav {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.nav a:not(.btn) {
    color: var(--text-muted);
    font-size: 0.9rem;
    font-weight: 500;
}

.nav a:not(.btn):hover {
    color: var(--text-main);
}

@media (max-width: 768px) {
    .nav a:not(.btn) {
        display: none;
    }

    /* Hide links on mobile, keep CTA */
}

/* Hero v2 */
.hero {
    padding: 6rem 0 4rem;
    overflow: hidden;
}

.text-center {
    text-align: center;
}

.scarcity-pill {
    display: inline-block;
    background: rgba(16, 185, 129, 0.1);
    color: var(--success);
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
}

.hero-title {
    font-size: 3.5rem;
    line-height: 1.1;
    font-weight: 800;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
}

.gradient-text {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-lead {
    font-size: 1.25rem;
    color: var(--text-muted);
    max-width: 600px;
    margin: 0 auto 2.5rem;
}

.hero-ctas {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 4rem;
}

.microcopy {
    font-size: 0.85rem;
    color: var(--text-muted);
    opacity: 0.8;
}

/* Visual Mockup - Weekly Balance */
.hero-visual-card {
    perspective: 1000px;
}

.weekly-balance-mockup {
    background: var(--bg-card);
    max-width: 400px;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    transform: rotateX(5deg);
    transition: transform 0.5s;
}

.weekly-balance-mockup:hover {
    transform: rotateX(0deg);
}

.wb-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.badge.success {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
}

.wb-graph {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 120px;
    margin-bottom: 1.5rem;
    gap: 8px;
}

.day-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
}

.day-col span {
    font-size: 0.7rem;
    color: var(--text-muted);
}

.bar {
    width: 100%;
    background: var(--border);
    border-radius: 4px;
    opacity: 0.5;
    transition: height 1s;
}

.day-col.manual .bar {
    background: var(--danger);
    opacity: 1;
}

/* The bad day */
.day-col:not(.manual) .bar {
    background: var(--success);
    opacity: 0.8;
}

/* Adjusted days */

.wb-message {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    text-align: left;
    line-height: 1.4;
}

.wb-message span {
    display: block;
    color: var(--primary);
    margin-bottom: 4px;
}

.wb-message strong {
    color: var(--text-main);
}


/* Section Utiliites */
.section {
    padding: 5rem 0;
}

.section.dark-alt {
    background: #162033;
}

.section-header {
    text-align: center;
    margin-bottom: 3rem;
}

.section-header h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.section-header p {
    color: var(--text-muted);
    font-size: 1.1rem;
}

/* Grid 3 */
.grid-3 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    transform: translateY(-3px);
}

.emoji {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.card-problem h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
}

.card-problem p {
    color: var(--text-muted);
    font-size: 0.95rem;
    margin: 0;
}

/* Concept */
.split-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.eyebrow {
    color: var(--primary);
    font-weight: 700;
    font-size: 0.9rem;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    display: block;
}

.text-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    line-height: 1.1;
}

.concept-list {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
}

.concept-list li {
    margin-bottom: 1rem;
    font-size: 1rem;
    color: var(--text-muted);
}

.concept-list strong {
    color: var(--text-main);
}

.quote-box {
    border-left: 4px solid var(--primary);
    padding-left: 1rem;
    font-style: italic;
    color: var(--text-main);
    font-size: 1.1rem;
}

.concept-graphic {
    background: var(--bg-card);
    padding: 2rem;
    border-radius: 16px;
    border: 1px dashed var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.c-day {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
}

.c-day.bad {
    background: rgba(239, 68, 68, 0.2);
    color: var(--danger);
    font-size: 1.2rem;
}

.arrow {
    font-size: 1.5rem;
    transform: rotate(90deg);
}

.distribution {
    display: flex;
    gap: 8px;
}

.c-day.good-small {
    background: rgba(16, 185, 129, 0.2);
    color: var(--success);
    font-size: 0.9rem;
}

.caption {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    .split-layout {
        grid-template-columns: 1fr;
    }

    .arrow {
        transform: rotate(90deg);
    }
}

/* Steps */
.steps-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
}

.step-item {
    background: var(--bg-card);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--border);
    position: relative;
}

.step-num {
    position: absolute;
    top: -15px;
    left: -15px;
    width: 40px;
    height: 40px;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 800;
    font-size: 1.2rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.step-item h4 {
    margin: 1rem 0 0.5rem;
    font-size: 1.2rem;
}

.step-item p {
    font-size: 0.95rem;
    color: var(--text-muted);
    margin: 0;
}

.center-cta {
    text-align: center;
}

@media (max-width: 700px) {
    .steps-row {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}

/* Trust Box */
.trust-box {
    background: var(--bg-card);
    padding: 2.5rem;
    border-radius: 16px;
    border: 1px solid var(--border);
    text-align: center;
}

.trust-box h3 {
    margin-top: 0;
    margin-bottom: 2rem;
}

.check-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    list-style: none;
    padding: 0;
    text-align: left;
}

.check-grid li {
    font-size: 1rem;
}

@media (max-width: 600px) {
    .check-grid {
        grid-template-columns: 1fr;
    }
}

/* FAQ */
.faq-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.faq-item {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
}

.faq-item summary {
    padding: 1rem;
    cursor: pointer;
    font-weight: 600;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.faq-item summary::after {
    content: '+';
    font-size: 1.2rem;
    margin-left: auto;
}

.faq-item[open] summary::after {
    content: '-';
}

.faq-item p {
    padding: 0 1rem 1rem;
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.5;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Pricing V2 */
.pricing-header-v2 {
    text-align: center;
    margin-bottom: 3rem;
}

.pricing-header-v2 h2 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.pricing-grid-v2 {
    display: flex;
    justify-content: center;
    gap: 2rem;
    align-items: stretch;
    max-width: 800px;
    margin: 0 auto;
}

.p-card {
    flex: 1;
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 2rem;
    border-radius: 16px;
    text-align: center;
    position: relative;
    display: flex;
    flex-direction: column;
}

.p-card.featured {
    border-color: var(--primary);
    background: linear-gradient(180deg, #1e293b 0%, #162033 100%);
    transform: scale(1.05);
    z-index: 2;
    box-shadow: 0 10px 40px -10px rgba(245, 158, 11, 0.2);
}

.pill-rec {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: white;
    padding: 4px 12px;
    border-radius: 99px;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
}

.p-card h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem;
}

.price {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-main);
}

.price small {
    font-size: 1rem;
    color: var(--text-muted);
    font-weight: 400;
}

.sub-price {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 2rem;
}

.benefits-mini {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.benefits-mini li {
    font-size: 0.95rem;
    color: var(--text-muted);
}

.benefits-mini strong {
    color: var(--text-main);
}

@media (max-width: 700px) {
    .pricing-grid-v2 {
        flex-direction: column;
    }

    .p-card.featured {
        transform: none;
    }
}

/* Footer CTA */
.footer-cta {
    padding: 6rem 0;
    background: linear-gradient(180deg, var(--bg-dark), #1e293b);
    border-top: 1px solid var(--border);
    margin-top: 4rem;
}

.footer-cta h2 {
    font-size: 2.5rem;
    line-height: 1.2;
    margin-bottom: 1rem;
}

.footer-copy {
    margin-top: 4rem;
    color: var(--text-muted);
    font-size: 0.8rem;
}

/* Responsive General */
@media (max-width: 600px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .section-header h2 {
        font-size: 2rem;
    }
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
</style>
