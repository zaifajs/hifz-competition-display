<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Navbar from './components/Navbar.vue';
import Loader from './components/Loader.vue';

const store = useStore();
const selectedProfile = ref(null);
const selectedPageNo = ref(1)

onMounted(async () => {
  await store.dispatch('fetchProfiles')

  if (store.state.profiles.length > 0) {
    selectedProfile.value = store.state.profiles[0]
  }
})

const onSelectProfile = (selectedIndex) => {
  selectedProfile.value = store.state.profiles[selectedIndex]
}

const onChangePageNo = (pageNo) => {
  if (!isNaN(pageNo) && pageNo > 0) {
    selectedPageNo.value = pageNo;
  }
}
</script>

<template>
  <Loader v-if="store.state.loading" message="Loading participants..." />

  <div v-else-if="store.state.error" class="error-container">
    <div class="error-message">
      <h2>Error</h2>
      <p>{{ store.state.error }}</p>
      <button @click="store.dispatch('fetchProfiles')" class="retry-button">Retry</button>
    </div>
  </div>

  <template v-else>
    <Navbar v-if="store.state.profiles.length" :profiles="store.state.profiles" :onSelectProfile="onSelectProfile" :onChangePageNo="onChangePageNo">
    </Navbar>

    <router-view v-if="selectedProfile" :selectedProfile="selectedProfile" :selectedPageNo="selectedPageNo" />
  </template>
</template>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.error-message {
  text-align: center;
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  border: 4px solid #ff4444;
  max-width: 500px;
}

.error-message h2 {
  color: #ff4444;
  font-size: 32px;
  margin-bottom: 20px;
}

.error-message p {
  color: #717171;
  font-size: 18px;
  margin-bottom: 30px;
}

.retry-button {
  padding: 12px 30px;
  font-size: 18px;
  background-color: #D2910F;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #b87a0d;
}
</style>
