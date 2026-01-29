<template>
    <div class="date-picker-input" @click="openPicker">
        <label v-if="label" class="label">{{ label }}</label>
        <div class="input-display">
            <span class="date-text" :class="{ placeholder: !modelValue }">
                {{ formattedDate || placeholder }}
            </span>
            <span class="icon">📅</span>
        </div>
        <input ref="pickerInput" type="date" :value="modelValue" @input="onChange" class="hidden-picker" />
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { formatDateBR } from '../utils/date';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Selecionar data'
    }
});

const emit = defineEmits(['update:modelValue']);
const pickerInput = ref(null);

const formattedDate = computed(() => {
    return props.modelValue ? formatDateBR(props.modelValue) : '';
});

function onChange(event) {
    emit('update:modelValue', event.target.value);
}

function openPicker() {
    if (pickerInput.value && pickerInput.value.showPicker) {
        pickerInput.value.showPicker();
    } else {
        pickerInput.value?.focus();
        // Fallback click if needed
        pickerInput.value?.click();
    }
}
</script>

<style scoped>
.date-picker-input {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    cursor: pointer;
}

.label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text-muted);
}

.input-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--color-bg-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    /* Smooth rounded corners */
    transition: all 0.2s;
}

.date-picker-input:hover .input-display {
    border-color: var(--color-primary);
    background: var(--color-bg-body);
}

.date-text {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-main);
}

.date-text.placeholder {
    color: var(--color-text-light);
    font-weight: 400;
}

.icon {
    font-size: 1.2rem;
    opacity: 0.6;
}

.hidden-picker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
    cursor: pointer;
}
</style>
