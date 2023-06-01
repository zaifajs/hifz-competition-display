<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ROUTE_TV_OUTPUT } from '../constants'

const currentRoute = useRoute();

const { profiles, onSelectProfile, onChangePageNo } = defineProps({
  profiles: Array,
  onSelectProfile: Function,
  onChangePageNo: Function,
})

let selectedIndex = ref(0)
let pageNo = ref(1)

watch(selectedIndex, onSelectProfile)
watch(pageNo, onChangePageNo)

const onPrev = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

const onNext = () => {
  if (selectedIndex.value < profiles.length - 1) {
    selectedIndex.value++
  }
}

const isPrevBtnDisabled = () => {
  return selectedIndex.value == 0
}

const isNextBtnDisabled = () => {
  return selectedIndex.value == profiles.length - 1
}
</script>

<template>
  <header>
    <div class="container header-content">
      <div class="left-side">
        <select id="selectedProfile-select" v-model="selectedIndex">
          <option v-for="(data, index) in profiles" :key="index" :value="index">
            {{ index + 1 }} - {{ data['FIRST_AND_LAST_NAME'] }}
          </option>
        </select>

        <div class="p-1">
          <button @click="onPrev" :disabled="isPrevBtnDisabled()">⬅️</button>
          <button @click="onNext" :disabled="isNextBtnDisabled()">➡️</button>
        </div>
      </div>

      <div v-if="currentRoute.path == ROUTE_TV_OUTPUT">
        <input v-model="pageNo" type="number" min="1" max="604" placeholder="Page">
      </div>
      <div v-else>
        <RouterLink :to="{ path: ROUTE_TV_OUTPUT }">TV Output</RouterLink>
      </div>
    </div>
  </header>
</template>