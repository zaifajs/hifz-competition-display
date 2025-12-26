import { ref } from 'vue';
import { useKeypress } from 'vue3-keypress';

/**
 * Composable for managing keyboard shortcuts
 * @param {Function} onPrev - Callback for previous action
 * @param {Function} onNext - Callback for next action
 * @returns {Object} Shortcut state and methods
 */
export function useKeyboardShortcuts(onPrev, onNext) {
  const isShortcutActive = ref(true);

  useKeypress({
    keyEvent: 'keyup',
    keyBinds: [
      {
        keyCode: 'left',
        success: onPrev,
        preventDefault: false,
      },
      {
        keyCode: 'right',
        success: onNext,
        preventDefault: false,
      },
    ],
    isActive: isShortcutActive,
  });

  const disableShortcuts = () => {
    isShortcutActive.value = false;
  };

  const enableShortcuts = () => {
    isShortcutActive.value = true;
  };

  return {
    isShortcutActive,
    disableShortcuts,
    enableShortcuts,
  };
}
