import axios from 'axios';

const API_BASE_URL = 'https://api.api-ninjas.com/v2';
const API_KEY = import.meta.env.VITE_NINJAS_API_KEY;

const SENTIMENT_TO_CATEGORIES = {
    'positive': ['inspirational', 'happiness', 'success', 'courage'],
    'negative': ['wisdom', 'philosophy', 'life', 'truth'],
    'neutral': ['wisdom', 'philosophy', 'life', 'truth'],
    'love': ['love', 'relationships', 'inspirational'],
    'motivation': ['success', 'courage', 'inspirational']
};

const RUSSIAN_TO_CATEGORIES = {
    'любовь': 'love',
    'люблю': 'love',
    'счастье': 'happiness',
    'радость': 'happiness',
    'успех': 'success',
    'мотивация': 'inspirational',
    'мудрость': 'wisdom',
    'жизнь': 'life',
    'философия': 'philosophy',
    'страх': 'fear',
    'смелость': 'courage',
    'искусство': 'art',
    'время': 'time',
    'свобода': 'freedom'
};

export const getQuoteByText = async (userText, sentiment = 'neutral') => {
    console.log(`🌐 Запрос к API Ninjas: "${userText}" (${sentiment})`);

    try {
        const categories = determineCategories(userText, sentiment);

        const params = {
            categories: categories.join(','),
            limit: 3
        };

        const response = await axios.get(`${API_BASE_URL}/quotes`, {
            headers: {
                'X-Api-Key': API_KEY
            },
            params: params,
            timeout: 10000
        });

        console.log('📥 Ответ от API Ninjas:', response.data);

        if (!response.data || response.data.length === 0) {
            throw new Error('API не вернул цитаты');
        }

        const selectedQuote = selectBestQuote(response.data, userText);

        return {
            text: selectedQuote.quote,
            author: selectedQuote.author || 'Unknown',
            work: selectedQuote.work || '',
            categories: selectedQuote.categories || [],
            source: "API Ninjas Quotes",
            isAI: false,
            sentiment: sentiment,
            relevanceScore: calculateRelevance(selectedQuote, userText)
        };

    } catch (error) {
        console.error('❌ Ошибка API Ninjas:', error.response?.data || error.message);
        return await getFallbackQuote(userText, sentiment);
    }
};

function determineCategories(userText, sentiment) {
    const userTextLower = userText.toLowerCase();
    const categories = new Set();

    if (SENTIMENT_TO_CATEGORIES[sentiment]) {
        SENTIMENT_TO_CATEGORIES[sentiment].forEach(cat => categories.add(cat));
    }

    for (const [russianWord, englishCategory] of Object.entries(RUSSIAN_TO_CATEGORIES)) {
        if (userTextLower.includes(russianWord)) {
            categories.add(englishCategory);
        }
    }

    if (categories.size === 0) {
        categories.add('wisdom');
        categories.add('life');
    }

    return Array.from(categories).slice(0, 3);
}

function selectBestQuote(quotes, userText) {
    const userTextLower = userText.toLowerCase();

    for (const quote of quotes) {
        const quoteTextLower = quote.quote.toLowerCase();

        const keywords = userTextLower.split(' ').filter(word => word.length > 3);
        for (const keyword of keywords) {
            if (quoteTextLower.includes(keyword)) {
                return quote;
            }
        }
    }

    return quotes[0];
}

function calculateRelevance(quote, userText) {
    let score = 0;
    const userTextLower = userText.toLowerCase();
    const quoteTextLower = quote.quote.toLowerCase();

    const userWords = userTextLower.split(' ').filter(word => word.length > 3);
    userWords.forEach(word => {
        if (quoteTextLower.includes(word)) score += 10;
    });

    if (quote.quote.length > 50 && quote.quote.length < 300) {
        score += 5;
    }

    return score;
}

async function getFallbackQuote(userText, sentiment) {
    console.log('🔄 Использую локальную базу как fallback');

    const { quotesDatabase } = await import('./quotesDatabase.js');

    const userTextLower = userText.toLowerCase();
    let relevantQuotes = [];

    for (const quote of quotesDatabase) {
        const quoteTextLower = quote.text.toLowerCase();
        if (quoteTextLower.includes(userTextLower) ||
            (quote.tags && quote.tags.some(tag => userTextLower.includes(tag)))) {
            relevantQuotes.push(quote);
        }
    }

    if (relevantQuotes.length === 0) {
        const sentimentTags = {
            'positive': ['счастье', 'радость', 'успех', 'мотивация'],
            'negative': ['мудрость', 'философия', 'жизнь'],
            'love': ['любовь', 'отношения']
        };

        const tags = sentimentTags[sentiment] || [];
        relevantQuotes = quotesDatabase.filter(quote =>
            quote.tags && quote.tags.some(tag => tags.includes(tag))
        );
    }

    const selectedQuote = relevantQuotes.length > 0
        ? relevantQuotes[Math.floor(Math.random() * relevantQuotes.length)]
        : quotesDatabase[Math.floor(Math.random() * quotesDatabase.length)];

    return {
        text: selectedQuote.text,
        author: selectedQuote.author,
        work: '',
        categories: selectedQuote.tags || [],
        source: "Локальная база (fallback)",
        isAI: false,
        sentiment: sentiment,
        relevanceScore: 0
    };
}

export const getRandomQuote = async (category = 'wisdom') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/quotes`, {
            headers: { 'X-Api-Key': API_KEY },
            params: { categories: category, limit: 1 }
        });

        if (response.data && response.data[0]) {
            return {
                text: response.data[0].quote,
                author: response.data[0].author,
                source: "API Ninjas Random"
            };
        }
    } catch (error) {
        console.error('Ошибка получения случайной цитаты:', error);
    }

    const { quotesDatabase } = await import('./quotesDatabase.js');
    const randomQuote = quotesDatabase[Math.floor(Math.random() * quotesDatabase.length)];
    return {
        text: randomQuote.text,
        author: randomQuote.author,
        source: "Локальная база"
    };
};

export const getQuoteOfTheDay = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/quoteoftheday`, {
            headers: { 'X-Api-Key': API_KEY }
        });

        if (response.data) {
            return {
                text: response.data.quote,
                author: response.data.author,
                date: response.data.date,
                source: "API Ninjas Quote of the Day"
            };
        }
    } catch (error) {
        console.error('Ошибка получения цитаты дня:', error);
    }

    return null;
};

export const getAvailableCategories = () => {
    return [
        'wisdom', 'philosophy', 'life', 'truth', 'inspirational',
        'relationships', 'love', 'faith', 'humor', 'success',
        'courage', 'happiness', 'art', 'writing', 'fear',
        'nature', 'time', 'freedom', 'death', 'leadership'
    ];
};

export const searchQuotesByAuthor = async (authorName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/quotes`, {
            headers: { 'X-Api-Key': API_KEY },
            params: { author: authorName, limit: 5 }
        });

        return response.data || [];
    } catch (error) {
        console.error('Ошибка поиска по автору:', error);
        return [];
    }
};
