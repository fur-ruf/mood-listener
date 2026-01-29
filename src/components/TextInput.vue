<template>
  <div class="text-input-container">
    <div class="input-header">
      <h3 class="input-title">How are you feeling?</h3>
      <p class="input-subtitle">Describe your emotions, thoughts or mood</p>
    </div>

    <div class="textarea-wrapper">
      <textarea
        v-model="text"
        class="input-textarea"
        placeholder="For example: 'I feel happy today' or 'I need motivation to work'..."
        rows="4"
        @keydown.enter.prevent="handleEnter"
      />

      <div class="textarea-footer">
        <div class="char-count" :class="{ 'char-limit': text.length > 300 }">
          {{ text.length }}/300
        </div>
        <div class="input-hint">Press Enter or the button below</div>
      </div>
    </div>

    <button
      @click="submit"
      class="submit-btn"
      :disabled="!isValidInput"
      :class="{ 'btn-disabled': !isValidInput }"
    >
      <span class="btn-text">Select a quote and music</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['submit'])
const text = ref('')

const isValidInput = computed(() => {
  return text.value.trim().length >= 3 && text.value.length <= 500
})

const submit = () => {
  if (!isValidInput.value) return
  emit('submit', text.value.trim())
}

const handleEnter = (event) => {
  if (event.ctrlKey || event.metaKey) {
    submit()
  }
}
</script>

<style scoped>
span {
  font-family: 'Bitcount Single', system-ui;
}
.text-input-container {
  width: 100%;
}

.input-header {
  text-align: center;
  margin-bottom: 2rem;
}

.input-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(86, 62, 56, 0.9);
  margin: 0 0 0.5rem;
}

.input-subtitle {
  font-size: 1.1rem;
  color: rgba(86, 62, 56, 0.85);
  margin: 0;
  font-weight: 400;
}

.textarea-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-textarea {
  width: 100%;
  padding: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.6;
  border: 2px solid rgba(255, 220, 212, 0.6);
  border-radius: 16px;
  background: rgba(255, 220, 212, 0.05);
  color: rgba(86, 62, 56, 0.95);
  resize: vertical;
  min-height: 120px;
  max-height: 300px;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-textarea:focus {
  outline: none;
  border-color: rgba(251, 173, 164, 0.612);
  box-shadow: 0 0 0 3px rgba(86, 62, 56, 0.01);
}

.input-textarea::placeholder {
  color: rgba(86, 62, 56, 0.65);
  font-style: italic;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  padding: 0 0.5rem;
}

.char-count {
  font-size: 0.9rem;
  color: rgba(86, 62, 56, 0.8);
  font-weight: 500;
}

.char-limit {
  color: #ff4757;
  font-weight: 600;
}

.input-hint {
  font-size: 0.9rem;
  color: rgba(86, 62, 56, 0.95);
  font-style: italic;
}

.submit-btn {
  width: 100%;
  padding: 1.2rem 2rem;
  background: rgba(251, 173, 164, 0.612);
  color: rgba(86, 62, 56, 0.95);
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.submit-btn:hover:not(.btn-disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px gba(86, 62, 56, 0.3);
}

.submit-btn:active:not(.btn-disabled) {
  transform: translateY(-1px);
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: rgba(178, 131, 126, 0.612);
}

.btn-disabled:hover {
  transform: none;
  box-shadow: none;
}

.btn-icon {
  font-size: 1.4rem;
}

@media (max-width: 768px) {
  .input-title {
    font-size: 1.5rem;
  }

  .input-subtitle {
    font-size: 1rem;
  }

  .submit-btn {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
  }

  .input-textarea {
    padding: 1.25rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .textarea-footer {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
