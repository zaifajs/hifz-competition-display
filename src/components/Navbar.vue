<script setup>
import { useKeypress } from "vue3-keypress";
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ROUTE_TV_OUTPUT } from '../constants'

const currentRoute = useRoute();

const { profiles, onSelectProfile, onChangePageNo } = defineProps({
  profiles: Array,
  onSelectProfile: Function,
  onChangePageNo: Function,
})

const isShortcutActive = ref(true)
const selectedIndex = ref(0)
const pageNo = ref(1)

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

useKeypress({
  keyEvent: "keyup",
  keyBinds: [
    {
      keyCode: "left",
      success: onPrev,
      preventDefault: false, // the default is true
    },
    {
      keyCode: "right",
      success: onNext,
      preventDefault: false, // the default is true
    },
  ],
  isActive: isShortcutActive,
});
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
        <input v-model="pageNo" @focus="() => isShortcutActive = false" @blur="() => isShortcutActive = true" type="number" min="1" max="619" placeholder="Page">
      </div>
      <div v-else>
        <RouterLink :to="{ path: ROUTE_TV_OUTPUT }">TV Output</RouterLink>
      </div>
    </div>
  </header>
</template>