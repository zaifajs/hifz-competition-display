<template>
  <div class="loader-overlay">
    <div class="loader-container">
      <div class="loader-spinner"></div>
      <p class="loader-text">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loader-spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top-color: #D2910F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-text {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 2px;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

