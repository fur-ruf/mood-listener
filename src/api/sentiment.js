// sentiment.js
import Sentiment from 'sentiment'
const sentiment = new Sentiment()

export function analyzeText(text) {
  const result = sentiment.analyze(text)

  // Определяем категорию настроения
  let moodCategory
  if (result.score > 2) moodCategory = 'positive'
  else if (result.score < -2) moodCategory = 'negative'
  else moodCategory = 'neutral'

  // Возвращаем полный объект
  return {
    category: moodCategory,
    score: result.score,
    comparative: result.comparative,
    positive: result.positive,
    negative: result.negative,
  }
}
