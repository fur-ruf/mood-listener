<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    :class="['music-icon', { pulse }]"
    :style="{ width: size, height: size, color: color }"
  >
    <path
      fill="currentColor"
      d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '4rem',
  },
  color: {
    type: String,
    default: '#fbaca4',
  },
  pulse: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.music-icon {
  transition: all 0.3s ease;
  opacity: 0.7;
}

.music-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.music-icon.pulse {
  animation: music-pulse 2s ease-in-out infinite;
}

@keyframes music-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}
</style>
