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
    <div class="container  header-content">
      <select id="selectedProfile-select" v-model="selectedIndex">
        <option v-for="(data, index) in allProfiles" :key="index" :value="index">
          {{index+1}} - {{ data['FIRST_AND_LAST_NAME'] }}
        </option>
      </select>

      <div class="p-1">
        <button @click="onPrev" :disabled="isPrevBtnDisabled()">prev</button>
        <button @click="onNext" :disabled="isNextBtnDisabled()">next</button>
      </div>
    </div>
  </header>

  <main v-if="selectedProfile" class="">
    <div class="main-content container">
      <div class="left-panel">
        <img src="./assets/images/ibr.jpg" />
        <!-- <img :src="'profiles/' + selectedProfile['PARTICIPANT_PHOTO']" /> -->
      </div>

      <div class="right-panel">

        <div class="name-container">
          <div class="name">
              {{ selectedProfile['FIRST_NAME'] }}
              <span class="name-last">{{ selectedProfile['LAST_NAME'] }}</span>
          </div>
        </div>
        <div class="details-container">
          <div class="div">
            <div class="age-container">
              <div class="meta">
                <div class="title">AGE</div>
                <div class="sub-title">AGE</div>
              </div>
               <span class="age">{{ selectedProfile['AGE_ON_EVENT'] }}</span>
            </div>
            <div class="country">
              <div class="flag">
                <div class="meta">
                  <div class="title">COUNTRY</div>
                  <div class="sub-title">PAÍS</div>
                </div>
                <div class="flag-detials">
                  <img width="100" :src="'flags/' + selectedProfile['FLAG_IMAGE']" class="flag" />
                  <span>{{ selectedProfile['FLAG'] }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="category">
            <div class="meta">
              <div class="title">CATEGORY</div>
              <div class="sub-title">CATEGORIA</div>
            </div>
            <img :src="'categories/' + selectedProfile['CATEGORY_IMAGE']" />
          </div>
        </div>
        <div class="logo-container">
          <img height="85" src="./assets/images/organization_logos.jpg" />
        </div>
      </div>

    </div>
  </main>
</template>

<style>

</style>
