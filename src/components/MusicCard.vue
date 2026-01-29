<template>
  <div class="music-card">
    <div class="card-header">
      <div class="music-icon">🎵</div>
      <h3 class="card-title">Music for the mood</h3>
    </div>

    <div v-if="track?.videoId" class="player-container">
      <div v-if="playerError" class="player-error">
        <p>{{ playerError }}</p>
        <button @click="openInYouTube" class="youtube-link-button">Open in YouTube</button>
      </div>

      <div v-else class="youtube-wrapper">
        <div id="youtube-player"></div>
        <div v-if="!isPlayerReady" class="player-loading">
          <div class="loading-spinner-small"></div>
          <p>Loading player...</p>
        </div>
      </div>
    </div>

    <div v-if="track" class="track-info">
      <h4 class="track-title">{{ track.title }}</h4>
      <p v-if="track.channelTitle" class="track-channel">{{ track.channelTitle }}</p>

      <div class="track-actions">
        <button @click="openInYouTube" class="youtube-button">
          <span>Listen on YouTube</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  track: Object,
})

const player = ref(null)
const isPlayerReady = ref(false)
const playerError = ref(null)

onMounted(() => {
  if (props.track?.videoId) {
    loadYouTubeAPI()
  }
})

onUnmounted(() => {
  if (player.value) {
    player.value.destroy()
  }
})

watch(
  () => props.track,
  (newTrack) => {
    if (newTrack?.videoId) {
      playerError.value = null
      if (!window.YT) {
        loadYouTubeAPI()
      } else {
        initializePlayer()
      }
    }
  },
)

const loadYouTubeAPI = () => {
  if (window.YT) {
    initializePlayer()
    return
  }

  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

  window.onYouTubeIframeAPIReady = initializePlayer
}

const initializePlayer = () => {
  if (!window.YT || !props.track?.videoId) return

  try {
    player.value = new window.YT.Player('youtube-player', {
      height: '200',
      width: '100%',
      videoId: props.track.videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          isPlayerReady.value = true
          playerError.value = null
        },
        onError: (event) => {
          playerError.value = getYouTubeError(event.data)

          if (player.value) {
            player.value.destroy()
            player.value = null
          }
        },
        onStateChange: (event) => {},
      },
    })
  } catch (error) {
    playerError.value = 'Не удалось загрузить плеер'
  }
}

const getYouTubeError = (errorCode) => {
  const errors = {
    2: 'Invalid video ID',
    5: 'HTML5 player error',
    100: 'Video not found',
    101: 'Reproduction on this site is prohibited.',
    150: 'Reproduction on this site is prohibited.',
  }
  return errors[errorCode] || `Error YouTube (code: ${errorCode})`
}

const openInYouTube = () => {
  if (props.track?.videoId) {
    window.open(`https://www.youtube.com/watch?v=${props.track.videoId}`, '_blank')
  }
}
</script>

<style scoped>
span {
  font-family: 'Bitcount Single', system-ui;
}
.music-card {
  background: rgba(255, 220, 212, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(86, 62, 56, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.music-icon {
  font-size: 1.5rem;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(86, 62, 56, 0.8);
  margin: 0;
}

.player-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.youtube-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  min-height: 200px;
}

#youtube-player {
  width: 100%;
  height: 200px;
}

.player-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 220, 212, 0.3);
  color: rgba(86, 62, 56, 0.8);
}

.loading-spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.player-error {
  background: rgba(255, 220, 212, 0.3);
  border: 1px solid #fed7d7;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  color: #c53030;
}

.youtube-link-button {
  background: rgba(251, 173, 164, 0.612);
  color: rgba(86, 62, 56, 0.8);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.75rem;
  transition: background 0.3s;
}

.track-info {
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.track-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(86, 62, 56, 0.8);
  margin: 0 0 0.25rem 0;
}

.track-channel {
  font-size: 0.9rem;
  color: rgba(86, 62, 56, 0.8);
  margin: 0 0 1rem 0;
}

.track-actions {
  display: flex;
  justify-content: center;
}

.youtube-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
  background: rgba(251, 173, 164, 0.612);
  color: rgba(86, 62, 56, 0.8);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.youtube-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(86, 62, 56, 0.2);
}

@media (max-width: 768px) {
  .music-card {
    padding: 1rem;
  }

  #youtube-player {
    height: 180px;
  }

  .youtube-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
