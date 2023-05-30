<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
let allProfiles = ref([])
let selectedIndex = ref(0)
let selectedProfile = ref({})

onMounted(async () => {
  await store.dispatch('fetchCSVData')
  allProfiles.value = store.state.csvData

  if (allProfiles.value.length > 0) {
    selectedProfile.value = allProfiles.value[selectedIndex.value]
  }
})

watch(selectedIndex, (newIndex) => {
  selectedProfile.value = allProfiles.value[newIndex]
})

const onPrev = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

const onNext = () => {
  if (selectedIndex.value < allProfiles.value.length - 1) {
    selectedIndex.value++
  }
}

const isPrevBtnDisabled = () => {
  return selectedIndex.value == 0
}

const isNextBtnDisabled = () => {
  return selectedIndex.value == allProfiles.value.length - 1
}
</script>

<template>
  <header>
    <div class="dis-f p-1">
      <select id="selectedProfile-select" v-model="selectedIndex">
        <option v-for="(data, index) in allProfiles" :key="index" :value="index">
          {{ data['FIRST_AND_LAST_NAME'] }}
        </option>
      </select>

      <div class="p-1">
        <button @click="onPrev" :disabled="isPrevBtnDisabled()">prev</button>
        <button @click="onNext" :disabled="isNextBtnDisabled()">next</button>
      </div>
    </div>
  </header>

  <main v-if="selectedProfile" class="dis-f">
    <div class="left-panel p-1">
      <img :src="'profiles/' + selectedProfile['PARTICIPANT_PHOTO']" />
    </div>

    <div class="right-panel p-1">
      <div class="name">{{ selectedProfile['FIRST_NAME'] }} <span>{{ selectedProfile['LAST_NAME'] }}</span></div>
      <div class="meta dis-f">
        <div class="age">Age <span>{{ selectedProfile['AGE_ON_EVENT'] }}</span></div>
        <div class="country">
          <div class="flag dis-f">
            <span>country </span>
            <div class="dis-f">
              <img :src="'flags/' + selectedProfile['FLAG_IMAGE']" class="flag" />
              <span>{{ selectedProfile['FLAG'] }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="category"><span>category</span> <img :src="'categories/' + selectedProfile['CATEGORY_IMAGE']" /></div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
.dis-f {
  display: flex;
}
.dis-f-col {
  flex-direction: column;
}
.dis-f-row {
  flex-direction: row;
}
.p-1 {
  padding: 10px;
}
.flag {
  width: 100px;
  height: 100px;
}
</style>
