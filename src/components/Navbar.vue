<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ROUTE_HOME, ROUTE_TV_OUTPUT, QURAN_MIN_PAGE, QURAN_MAX_PAGES, PROFILE_FIELDS } from '../constants';
import { useProfileNavigation } from '../composables/useProfileNavigation';
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
    default: () => [],
  },
  onSelectProfile: {
    type: Function,
    required: true,
  },
  onChangePageNo: {
    type: Function,
    required: true,
  },
});

const currentRoute = useRoute();
const pageNo = ref(QURAN_MIN_PAGE);

// Profile navigation
const { selectedIndex, isPrevDisabled, isNextDisabled, goToPrev, goToNext } = useProfileNavigation(
  computed(() => props.profiles),
  props.onSelectProfile
);

// Keyboard shortcuts
const { disableShortcuts, enableShortcuts } = useKeyboardShortcuts(goToPrev, goToNext);

// Watch for changes
watch(selectedIndex, (newIndex) => {
  props.onSelectProfile(newIndex);
});

watch(pageNo, (newPageNo) => {
  props.onChangePageNo(newPageNo);
});

const isOnRecitationsPage = computed(() => currentRoute.path === ROUTE_TV_OUTPUT);

const handleInputFocus = () => disableShortcuts();
const handleInputBlur = () => enableShortcuts();
</script>

<template>
  <header>
    <div class="container header-content">
      <div class="left-side">
        <select id="selectedProfile-select" v-model="selectedIndex">
          <option v-for="(profile, index) in profiles" :key="index" :value="index">
            {{ profile[PROFILE_FIELDS.FIRST_AND_LAST_NAME] }}
          </option>
        </select>

        <div class="navigation-buttons">
          <button @click="goToPrev" :disabled="isPrevDisabled" aria-label="Previous participant">
            ⬅️
          </button>
          <button @click="goToNext" :disabled="isNextDisabled" aria-label="Next participant">
            ➡️
          </button>
        </div>
      </div>

      <div class="right-side">
        <div v-if="isOnRecitationsPage" class="page-number-container">
          <label for="page-number-input">Input page number</label>
          <input
            id="page-number-input"
            v-model.number="pageNo"
            type="number"
            :min="QURAN_MIN_PAGE"
            :max="QURAN_MAX_PAGES"
            placeholder="Page number"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
          />
        </div>

        <router-link
          v-if="isOnRecitationsPage"
          :to="ROUTE_HOME"
          class="nav-link"
        >
          Back to Participant
        </router-link>
        <router-link
          v-else
          :to="ROUTE_TV_OUTPUT"
          class="nav-link"
        >
          Recitations page
        </router-link>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import '../assets/scss/variables';
@import '../assets/scss/mixins';

.navigation-buttons {
  display: flex;
  gap: 5px;
}

.page-number-container {
  @include flex-center;
  gap: $spacing-xs;

  label {
    font-size: $font-size-sm;
    color: $color-gray;
    margin-right: $spacing-xs;
    white-space: nowrap;
  }

  input {
    width: 100px;
    min-width: auto;

    &[type="number"] {
      @include hide-number-spinner;
    }

    &[placeholder] {
      text-align: left;
      letter-spacing: 0;
    }
  }
}

.nav-link {
  padding: 11px $spacing-sm;
  font-size: $font-size-sm;
  color: $color-gray;
  text-decoration: none;
  margin-right: $spacing-xs;
  display: inline-block;
  @include button-reset;
  transition: color $transition-base;

  &:hover {
    color: $color-orange;
  }

  &.router-link-active {
    color: $color-orange;
    font-weight: $font-weight-bold;
  }
}

.right-side {
  @include flex-center;
  gap: $spacing-xs;
}
</style>
