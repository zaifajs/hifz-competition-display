<script setup>
import { computed } from 'vue';
import { PROFILE_FIELDS, ASSET_PATHS, QURAN_MAX_PAGES } from '../constants';

const props = defineProps({
  selectedProfile: {
    type: Object,
    default: null,
  },
  selectedPageNo: {
    type: Number,
    default: 1,
  },
});

const quranPageImage = computed(() => {
  const pageNumber = String(props.selectedPageNo || 1).padStart(3, '0');
  return `${ASSET_PATHS.QURAN}${pageNumber}.png`;
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
            {{ selectedProfile[PROFILE_FIELDS.FIRST_NAME] }}
            <span>{{ selectedProfile[PROFILE_FIELDS.LAST_NAME] }}</span>
          </div>
          <div class="country">
            <img
              width="100"
              :src="`${ASSET_PATHS.FLAGS}${selectedProfile[PROFILE_FIELDS.FLAG_IMAGE]}`"
              :alt="selectedProfile[PROFILE_FIELDS.FLAG]"
              class="flag"
            />
            <span>{{ selectedProfile[PROFILE_FIELDS.FLAG] }}</span>
          </div>
        </div>

        <div class="org-logo-container">
          <div class="org-logos">
            <img src="../assets/images/organization_logos.jpg" alt="Organization logos" />
          </div>
          <div class="category">
            <img
              :src="`${ASSET_PATHS.CATEGORIES}${selectedProfile[PROFILE_FIELDS.CATEGORY_IMAGE]}`"
              :alt="selectedProfile[PROFILE_FIELDS.CATEGORY]"
            />
          </div>
        </div>
      </div>

      <div class="right-panel">
        <div class="page-wrapper">
          <img
            :src="quranPageImage"
            :alt="`Quran page ${selectedPageNo}`"
          />
        </div>
      </div>
    </div>
  </main>
</template>