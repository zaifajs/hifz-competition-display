<script setup>
const { selectedProfile } = defineProps({
  selectedProfile: Object | null,
});
</script>


<template>
  <main v-if="selectedProfile" class="">
    <div class="main-content container">

      <div class="left-panel">
      </div>

      <div class="right-panel">
        <div class="name-container">

        </div>
        <div class="details-container">
          {{ selectedProfile['FIRST_AND_LAST_NAME'] }}
          <div class="flag-detials">
            <img width="100" :src="'flags/' + selectedProfile['FLAG_IMAGE']" class="flag" />
            <span>{{ selectedProfile['FLAG'] }}</span>
          </div>
        </div>

        <div class="logo-container">
          <img height="85" src="../assets/images/organization_logos.jpg" />

          <img :src="'categories/' + selectedProfile['CATEGORY_IMAGE']" />
        </div>
      </div>
    </div>
  </main>
</template>