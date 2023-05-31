<script setup>
const { selectedProfile } = defineProps({
  selectedProfile: Object | null,
});
</script>

<template>
  <main v-if="selectedProfile" class="">
    <div class="main-content container">
      <div class="left-panel">
        <img :src="'src/assets/images/participants/' + selectedProfile['PARTICIPANT_PHOTO']" />
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
          <img height="85" src="../assets/images/organization_logos.jpg" />
        </div>
      </div>

    </div>
  </main>
</template>

<style></style>
