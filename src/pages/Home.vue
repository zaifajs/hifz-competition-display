<script setup>
import { PROFILE_FIELDS, ASSET_PATHS } from '../constants';

const props = defineProps({
  selectedProfile: {
    type: Object,
    default: null,
  },
});
</script>

<template>
  <main v-if="selectedProfile" class="">
    <div class="main-content container profile">
      <div class="left-panel">
        <img
          :src="`${ASSET_PATHS.PARTICIPANTS}${selectedProfile[PROFILE_FIELDS.PARTICIPANT_PHOTO]}`"
          :alt="`${selectedProfile[PROFILE_FIELDS.FIRST_NAME]} ${selectedProfile[PROFILE_FIELDS.LAST_NAME]}`"
        />
      </div>

      <div class="right-panel">
        <div class="name-container">
          <div class="name">
            {{ selectedProfile[PROFILE_FIELDS.FIRST_NAME] }}
            <span class="name-last">{{ selectedProfile[PROFILE_FIELDS.LAST_NAME] }}</span>
          </div>
        </div>

        <div class="details-container">
          <div class="details-row">
            <div class="age-container">
              <div class="meta min-w-250">
                <div class="title">AGE</div>
                <div class="sub-title">IDADE</div>
              </div>
              <span class="age">{{ selectedProfile[PROFILE_FIELDS.AGE_ON_EVENT] }}</span>
            </div>

            <div class="country">
              <div class="flag">
                <div class="meta">
                  <div class="title">COUNTRY</div>
                  <div class="sub-title">PAÍS</div>
                </div>
                <div class="flag-details">
                  <img
                    width="100"
                    :src="`${ASSET_PATHS.FLAGS}${selectedProfile[PROFILE_FIELDS.FLAG_IMAGE]}`"
                    :alt="selectedProfile[PROFILE_FIELDS.FLAG]"
                    class="flag"
                  />
                  <span>{{ selectedProfile[PROFILE_FIELDS.FLAG] }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="category">
            <div class="meta min-w-250">
              <div class="title">CATEGORY</div>
              <div class="sub-title">CATEGORIA</div>
            </div>
            <img
              :src="`${ASSET_PATHS.CATEGORIES}${selectedProfile[PROFILE_FIELDS.CATEGORY_IMAGE]}`"
              :alt="selectedProfile[PROFILE_FIELDS.CATEGORY]"
            />
          </div>
        </div>

        <div class="logo-container">
          <img
            height="100"
            src="../assets/images/organization_logos.jpg"
            alt="Organization logos"
          />
        </div>
      </div>

    </div>
  </main>
</template>

<style></style>
