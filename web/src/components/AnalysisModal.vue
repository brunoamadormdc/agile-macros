<template>
    <div class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-card">
            <header>
                <h3>🧠 Análise Semanal IA</h3>
                <button class="close-btn" @click="$emit('close')">×</button>
            </header>
            <div class="content markdown-body">
                <div v-if="loading" class="loading-state">
                    <p>Analisando sua semana... ⏳</p>
                </div>
                <div v-else class="text-content">
                    <!-- Simple rendering. For full markdown support we'd need a library like markdown-it.
               For now, we just preserve whitespace or assume basic text. 
               If complex MD is needed, we should install a library later.
               Let's try to do basic replacing for headers for better look.
          -->
                    <div v-html="formattedContent"></div>
                </div>
            </div>
            <footer>
                <button class="btn" @click="$emit('close')">Fechar</button>
            </footer>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    content: String,
    loading: Boolean
});

defineEmits(['close']);

// Simple formatter to make the AI text look decent without full MD library
const formattedContent = computed(() => {
    if (!props.content) return '';
    let html = props.content
        .replace(/^## (.*$)/gim, '<h4>$1</h4>') // H2 -> H4
        .replace(/^### (.*$)/gim, '<h5>$1</h5>') // H3 -> H5
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br>'); // Newlines

    return html;
});
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal-card {
    background: var(--color-bg-card);
    padding: 1.5rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text-muted);
}

.loading-state {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
    color: var(--color-text-muted);
}

.text-content {
    line-height: 1.6;
    color: var(--color-text-body);
}

footer {
    margin-top: 1.5rem;
    text-align: right;
}
</style>
