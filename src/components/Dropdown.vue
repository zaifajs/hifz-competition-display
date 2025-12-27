<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  placeholder: {
    type: String,
    default: 'Select...',
  },
});

const emit = defineEmits(['update:modelValue', 'open', 'close']);

const isOpen = ref(false);
const dropdownRef = ref(null);

const selectedLabel = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) return props.placeholder;
  const option = props.options[props.modelValue];
  if (!option) return props.placeholder;
  return typeof option === 'string' ? option : option[props.optionLabel];
});

const toggleDropdown = () => {
  const wasOpen = isOpen.value;
  isOpen.value = !isOpen.value;

  if (isOpen.value && !wasOpen) {
    emit('open');
  } else if (!isOpen.value && wasOpen) {
    emit('close');
  }
};

const selectOption = (index) => {
  emit('update:modelValue', index);
  isOpen.value = false;
  emit('close');
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    if (isOpen.value) {
      isOpen.value = false;
      emit('close');
    }
  }
};

const handleKeydown = (event) => {
  if (!isOpen.value) return;

  if (event.key === 'Escape') {
    isOpen.value = false;
    emit('close');
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    const nextIndex = Math.min(props.modelValue + 1, props.options.length - 1);
    emit('update:modelValue', nextIndex);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    const prevIndex = Math.max(props.modelValue - 1, 0);
    emit('update:modelValue', prevIndex);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    isOpen.value = false;
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div ref="dropdownRef" class="dropdown" :class="{ 'dropdown--open': isOpen }">
    <button
      type="button"
      class="dropdown__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="toggleDropdown"
    >
      <span class="dropdown__selected">{{ selectedLabel }}</span>
      <span class="dropdown__arrow" :class="{ 'dropdown__arrow--open': isOpen }">▼</span>
    </button>

    <transition name="dropdown">
      <ul v-if="isOpen" class="dropdown__menu" role="listbox">
        <li
          v-for="(option, index) in options"
          :key="index"
          class="dropdown__option"
          :class="{ 'dropdown__option--selected': index === modelValue }"
          role="option"
          :aria-selected="index === modelValue"
          @click="selectOption(index)"
        >
          {{ typeof option === 'string' ? option : option[optionLabel] }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/scss/variables';
@import '../assets/scss/mixins';

.dropdown {
  position: relative;
  width: 400px;
}

.dropdown__trigger {
  width: 100%;
  padding: $spacing-xs $spacing-sm;
  padding-right: 70px;
  font-size: $font-size-sm;
  letter-spacing: $letter-spacing-sm;
  color: $color-gray;
  background-color: $color-white;
  border: 0;
  outline: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  transition: color $transition-base;

  &:hover {
    color: $color-orange;
  }

  &:focus {
    outline: 2px solid $color-orange;
    outline-offset: 2px;
  }
}

.dropdown__selected {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown__arrow {
  position: absolute;
  right: $spacing-sm;
  font-size: 12px;
  color: $color-gray;
  transition: transform $transition-base;
  pointer-events: none;

  &--open {
    transform: rotate(180deg);
  }
}

.dropdown__menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background-color: $color-white;
  border: 1px solid rgba($color-gray, 0.2);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 500px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
}

.dropdown__option {
  padding: $spacing-xs $spacing-sm;
  font-size: $font-size-sm;
  letter-spacing: $letter-spacing-sm;
  color: $color-gray;
  cursor: pointer;
  transition: background-color $transition-base, color $transition-base;

  &:hover {
    background-color: rgba($color-orange, 0.1);
    color: $color-orange;
  }

  &--selected {
    background-color: rgba($color-orange, 0.15);
    color: $color-orange;
    font-weight: $font-weight-semibold;
  }
}

// Transition animations
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity $transition-base, transform $transition-base;
  transform-origin: top;
}

.dropdown-enter-from {
  opacity: 0;
  transform: scaleY(0.95) translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-10px);
}
</style>

