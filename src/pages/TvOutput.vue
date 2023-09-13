<script setup>
const { selectedProfile, selectedPageNo } = defineProps({
  selectedProfile: Object | null,
  selectedPageNo: Number,
});
</script>


<template>
  <main v-if="selectedProfile">
    <div class="main-content container tv-output">
      <div class="left-panel">
        <div class="stream-space">
        </div>
        <div class="details-container">
          <div class="name-container">
            {{ selectedProfile['FIRST_NAME'] }}
            <span>{{ selectedProfile['LAST_NAME'] }}</span>
          </div>
          <div class="country">
              <img width="100" :src="'flags/' + selectedProfile['FLAG_IMAGE']" class="flag" />
              <span>{{ selectedProfile['FLAG'] }}</span>
          </div>
        </div>

        <div class="org-logo-container">
          <div class="org-logos">
            <img src="../assets/images/organization_logos.jpg" />
          </div>
          <div class="category">
            <img :src="'categories/' + selectedProfile['CATEGORY_IMAGE']" />
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="page-wrapper">
          <img :src="'/fip/quran/'+String(selectedPageNo).padStart(3, '0')+'.png'" alt="">
        </div>
      </div>
    </div>
  </main>
</template>