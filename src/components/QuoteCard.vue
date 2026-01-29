<template>
  <div class="quote-card">
    <div class="quote-content">
      <p class="quote-text">"{{ text }}"</p>

      <div v-if="author" class="quote-author-section">
        <div class="author-divider"></div>
        <div class="author-info">
          <span class="quote-author">{{ author }}</span>
        </div>
      </div>
    </div>

    <div class="quote-actions">
      <button @click="copyQuote" class="copy-btn">
        <span class="copy-text">Copy quote</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: '',
  },
})

const copyQuote = () => {
  const textToCopy = props.author ? `"${props.text}" — ${props.author}` : `"${props.text}"`

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      showToast('Quote copied to clipboard!')
    })
    .catch((err) => {})
}

const showToast = (message) => {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(251, 173, 164, 0.9);
    color: rgba(86, 62, 56);
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 1000;
    font-weight: 500;
    animation: fadeInOut 3s ease;
  `
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards'
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 2700)
}
</script>

<style scoped>
span {
  font-family: 'Bitcount Single', system-ui;
}
.quote-card {
  background: rgba(255, 220, 212, 0.3);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(86, 62, 56, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.quote-card:hover {
  box-shadow: 0 15px 50px rgba(86, 62, 56, 0.12);
  transform: translateY(-5px);
}

.quote-content {
  flex: 1;
  margin-bottom: 1.5rem;
  position: relative;
}

.quote-text {
  font-size: 1.4rem;
  line-height: 1.7;
  color: rgba(86, 62, 56, 0.8);
  font-style: italic;
  margin: 0 0 1.5rem;
  font-weight: 400;
  text-align: center;
  padding: 0 1rem;
}

.quote-author-section {
  margin-top: 1.5rem;
}

.author-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 1.5rem auto;
  max-width: 200px;
}

.author-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.quote-author {
  font-size: 1.1rem;
  color: rgba(86, 62, 56, 0.65);
  font-weight: 600;
  font-style: normal;
}

.quote-actions {
  margin-top: auto;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: rgba(251, 173, 164, 0.612);
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  color: rgba(86, 62, 56, 0.8);
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(86, 62, 56, 0.15);
}

.copy-btn:active {
  transform: translateY(0);
}

.copy-icon {
  font-size: 1.2rem;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  15% {
    opacity: 1;
    transform: translateY(0);
  }
  85% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(10px);
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

@media (max-width: 768px) {
  .quote-card {
    padding: 1.5rem;
  }

  .quote-text {
    font-size: 1.2rem;
    padding: 0;
  }

  .quote-actions {
    flex-direction: column;
  }

  .copy-btn {
    padding: 0.8rem 1.2rem;
  }
}
</style>
