<script setup>
const { selectedProfile } = defineProps({
  selectedProfile: Object | null,
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
            <img height="85" src="../assets/images/organization_logos.jpg" />
          </div>
          <div class="category">
            <img :src="'categories/' + selectedProfile['CATEGORY_IMAGE']" />
          </div>
        </div>
      </div>

      <div class="right-panel">
        <img src="../assets/images/007.png" alt="">
      </div>
    </div>
  </main>
</template>