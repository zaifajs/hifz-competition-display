import { ref, computed } from 'vue';

/**
 * Composable for managing profile navigation
 * @param {Array} profiles - Array of profile objects
 * @param {Function} onSelectProfile - Callback when profile is selected
 * @returns {Object} Navigation state and methods
 */
export function useProfileNavigation(profiles, onSelectProfile) {
  const selectedIndex = ref(0);

  const isPrevDisabled = computed(() => selectedIndex.value === 0);
  const isNextDisabled = computed(() => {
    const profilesList = profiles.value || profiles;
    return selectedIndex.value >= profilesList.length - 1;
  });

  const goToPrev = () => {
    if (selectedIndex.value > 0) {
      selectedIndex.value--;
    }
  };

  const goToNext = () => {
    const profilesList = profiles.value || profiles;
    if (selectedIndex.value < profilesList.length - 1) {
      selectedIndex.value++;
    }
  };

  // Watch for index changes and call callback
  const updateSelectedIndex = (newIndex) => {
    selectedIndex.value = newIndex;
    if (onSelectProfile) {
      onSelectProfile(newIndex);
    }
  };

  return {
    selectedIndex,
    isPrevDisabled,
    isNextDisabled,
    goToPrev,
    goToNext,
    updateSelectedIndex,
  };
}
