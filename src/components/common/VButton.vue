<template>
  <button
    :type="type"
    :disabled="disabled"
    :title="title"
    :class="buttonClasses"
    @click.prevent="handleClick"
  >
    <slot>
      {{ $t('defaultButtonText') }}
    </slot>
  </button>
</template>

<script setup lang="ts">
// Modules
import { computed, toRefs, defineProps } from 'vue';
// Types
import { IButtonProps } from '@/types/buttons';

const props = withDefaults(defineProps<IButtonProps>(), {
  color: 'primary',
  disabled: false,
  title: '',
  type: 'button',
});

const {
  color,
  disabled,
  title,
  type,
} = toRefs(props);

// Emit
const emit = defineEmits<{
  (e: 'click'): void
}>()

// Computed
const buttonClasses = computed((): string => {
  const baseClasses = [
    'rounded', 
    'font-semibold', 
    'focus:outline-none', 
    'transition', 
    'duration-200',
    'flex', 
    'items-center', 
    'justify-center',
    'p-1',
  ];

  const colorClasses: Record<string, string> = {
    primary: 'bg-blue-600 text-white not-disabled:hover:bg-blue-700',
    secondary: 'bg-gray-300 text-gray-800 not-disabled:hover:bg-gray-400',
    danger: 'bg-red-600 text-white not-disabled:hover:bg-red-700',
    success: 'bg-green-600 text-white not-disabled:hover:bg-green-700'
  };

  return [
    ...baseClasses,
    colorClasses[color.value],
    disabled.value ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  ].join(' ')
});

// Methods
const handleClick = () => {
  emit('click');
};
</script>