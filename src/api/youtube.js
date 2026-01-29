const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search'

export const getMusicByText = async (userText) => {
  const cleanedText = cleanUserTextForSearch(userText)

  const query = `${cleanedText} music song`

  console.log(`🎵 Поиск музыки для: "${userText}" -> запрос: "${query}"`)

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '10',
    maxResults: '1',
    videoEmbeddable: 'true',
    safeSearch: 'strict',
    key: API_KEY,
    relevanceLanguage: 'en',
  })

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`)
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`YouTube API error: ${res.status} - ${errorText}`)
    }

    const data = await res.json()
    const video = data.items?.[0]

    if (!video) {
      console.warn('Музыка не найдена, использую fallback')
      return getFallbackMusic()
    }

    console.log('✅ Найдена музыка:', video.snippet.title)

    return {
      title: cleanVideoTitle(video.snippet.title),
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
      description: video.snippet.description,
      channelTitle: video.snippet.channelTitle
    }

  } catch (error) {
    return getFallbackMusic()
  }
}


function cleanUserTextForSearch(text) {
  if (!text || text.trim() === '') return 'inspirational'

  const words = text.toLowerCase()
    .split(/[\s,.!?;:]+/)
    .filter(word =>
      word.length > 2 &&
      !/\d+/.test(word)
    )
    .map(word => word.replace(/[^a-zа-яё]/gi, ''))
    .filter(word => word.length > 0)

  const significantWords = words
    .sort((a, b) => b.length - a.length)
    .slice(0, 3)

  return significantWords.length > 0 ? significantWords.join(' ') : 'inspirational'
}

function cleanVideoTitle(title) {
  return title
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/ft\.|feat\.|featuring/gi, '|')
    .replace(/\s+/g, ' ')
    .trim()
}

function getFallbackMusic() {
  const fallbackVideos = [
    {
      title: "Chill Study Music",
      videoId: "5qap5aO4i9A",
      thumbnail: "https://img.youtube.com/vi/5qap5aO4i9A/mqdefault.jpg"
    },
    {
      title: "Peaceful Piano Music",
      videoId: "7NOSDKb0HlU",
      thumbnail: "https://img.youtube.com/vi/7NOSDKb0HlU/mqdefault.jpg"
    },
    {
      title: "Relaxing Guitar Music",
      videoId: "n61ULEU7CO0",
      thumbnail: "https://img.youtube.com/vi/n61ULEU7CO0/mqdefault.jpg"
    }
  ]

  const randomVideo = fallbackVideos[Math.floor(Math.random() * fallbackVideos.length)]
  console.log('🎵 Использую fallback музыку:', randomVideo.title)

  return randomVideo
}

export const getMusicByMood = async (mood) => {
  const moodPlaylists = {
    happy: 'upbeat pop music',
    sad: 'melancholic indie music',
    calm: 'ambient relaxation music',
    energetic: 'electronic dance music',
    romantic: 'love songs',
    focused: 'study concentration music'
  }

  const query = moodPlaylists[mood] || 'background music'
  return getMusicByText(query)
}

export const searchMultipleMusic = async (text, limit = 3) => {
  const cleanedText = cleanUserTextForSearch(text)
  const query = `${cleanedText} music`

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '10',
    maxResults: limit.toString(),
    videoEmbeddable: 'true',
    safeSearch: 'strict',
    key: API_KEY,
  })

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`)
    if (!res.ok) throw new Error('YouTube API error')

    const data = await res.json()
    return data.items?.map(video => ({
      title: cleanVideoTitle(video.snippet.title),
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails?.medium?.url
    })) || []

  } catch (error) {
    return []
  }
}
