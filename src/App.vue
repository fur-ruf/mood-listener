<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">Mood Listener</h1>
      <p class="app-subtitle">Describe your mood and get a suitable quote and music</p>
    </header>

    <main class="app-content">
      <div class="input-section">
        <TextInput @submit="handleText" />
      </div>

      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Looking for the perfect quote and music...</p>
      </div>

      <div v-if="!isLoading" class="results-container">
        <div v-if="quote || track" class="cards-grid">
          <QuoteCard v-if="quote" :text="quote.text" :author="quote.author" class="card-item" />
          <MusicCard v-if="track" :track="track" class="card-item" />
        </div>

        <div v-else-if="!isLoading" class="empty-state">
          <div class="empty-icon">
            <MusicIcon size="4rem" :pulse="true" />
          </div>
          <h3 class="empty-title">Start by entering text</h3>
          <p class="empty-description">
            Describe your feelings or thoughts, and we will select the appropriate quote and music
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TextInput from './components/TextInput.vue'
import QuoteCard from './components/QuoteCard.vue'
import MusicCard from './components/MusicCard.vue'

import { analyzeText } from './api/sentiment'
import { getQuoteByText } from './api/ninjaQuotes.js'
import { getMusicByText } from './api/youtube'

import MusicIcon from './components/icons/IconMusic.vue'

const sentiment = ref(null)
const quote = ref(null)
const track = ref(null)
const isLoading = ref(false)

const handleText = async (text) => {
  sentiment.value = null
  quote.value = null
  track.value = null
  isLoading.value = true

  try {
    const sentimentResult = analyzeText(text)
    sentiment.value = {
      sentiment: sentimentResult.category,
      score: sentimentResult.score,
    }

    const quoteData = await getQuoteByText(text, sentimentResult.category)
    quote.value = {
      text: quoteData.text,
      author: quoteData.author || 'Unknown',
    }

    track.value = await getMusicByText(text)
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgba(255, 220, 212, 0.1);
  font-family: 'Bitcount Single', system-ui;
  transition: all 0.3s ease;
}

.app-header {
  text-align: center;
  padding: 2.5rem 1rem 1.5rem;
  background: rgba(251, 173, 164, 0.612);
  color: rgba(86, 62, 56, 0.95);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 20px gba(86, 62, 56, 0.02);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  letter-spacing: -0.5px;
  transition: font-size 0.3s ease;
}

.title-sub {
  font-weight: 400;
  font-size: 1.8rem;
  opacity: 0.9;
  transition: font-size 0.3s ease;
}

.app-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.app-content {
  flex: 1;
  padding: 0 1rem 2rem;
  width: 100%;
  box-sizing: border-box;
  transition: padding 0.3s ease;
}

@media (min-width: 1200px) {
  .app-content {
    max-width: 1200px;
    margin: 0 auto;
  }
}

.input-section {
  background: rgba(255, 220, 212, 0.3);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px rgba(86, 62, 56, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.input-section:hover {
  transform: translateY(-2px);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: rgba(255, 220, 212, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(86, 62, 56, 0.08);
  margin: 2rem 0;
  transition: all 0.3s ease;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid rgba(251, 173, 164, 0.612);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1.1rem;
  color: rgba(86, 62, 56, 0.8);
  font-weight: 500;
  transition: font-size 0.3s ease;
}

.results-container {
  margin-top: 1rem;
}

.cards-grid {
  display: grid;
  gap: 2rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2.5rem;
  }

  .app-content {
    padding: 0 2rem 2rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }

  .app-content {
    padding: 0 1.5rem 2rem;
  }

  .app-title {
    font-size: 2.2rem;
  }

  .title-sub {
    font-size: 1.6rem;
  }
}

@media (max-width: 767px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    gap: 1rem;
  }
}

.card-item {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card-item:hover {
  transform: translateY(-5px);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 220, 212, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(86, 62, 56, 0.06);
  margin-top: 2rem;
  transition: all 0.3s ease;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
  transition: font-size 0.3s ease;
}

.empty-title {
  font-size: 1.8rem;
  color: rgba(86, 62, 56, 0.8);
  margin-bottom: 0.75rem;
  font-weight: 700;
  transition: font-size 0.3s ease;
}

.empty-description {
  font-size: 1.1rem;
  color: rgba(86, 62, 56, 0.8);
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.6;
  transition: font-size 0.3s ease;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 0.75rem 1rem;
    border-radius: 0 0 16px 16px;
    margin-bottom: 1.5rem;
  }

  .app-title {
    font-size: 1.8rem;
  }

  .title-sub {
    font-size: 1.2rem;
  }

  .app-subtitle {
    font-size: 0.9rem;
    max-width: 300px;
  }

  .app-content {
    padding: 0 0.75rem 1.5rem;
  }

  .input-section {
    padding: 1rem;
    border-radius: 16px;
    margin-bottom: 1.5rem;
  }

  .loading-container {
    padding: 2rem;
    border-radius: 16px;
    margin: 1.5rem 0;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  .loading-text {
    font-size: 1rem;
  }

  .empty-state {
    padding: 2rem 1rem;
    border-radius: 16px;
    margin-top: 1.5rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.5rem;
  }

  .empty-description {
    font-size: 1rem;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .app-content {
    padding: 0 0.5rem 1.5rem;
  }

  .input-section,
  .loading-container,
  .empty-state {
    padding: 0.875rem;
  }

  .loading-spinner {
    width: 35px;
    height: 35px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .app-header,
  .input-section,
  .loading-container,
  .cards-grid,
  .empty-state {
    transition:
      padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      margin 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>
