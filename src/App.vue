<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Navbar from './components/Navbar.vue';

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
    console.log('selectedPageNo.value', selectedPageNo.value)
  }
}
</script>

<template>
  <Navbar v-if="store.state.profiles.length" :profiles="store.state.profiles" :onSelectProfile="onSelectProfile" :onChangePageNo="onChangePageNo">
  </Navbar>

  <router-view v-if="selectedProfile" :selectedProfile="selectedProfile" />
</template>

<style></style>
