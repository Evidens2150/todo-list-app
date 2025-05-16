<template>
  <select
    v-model="model"
    :class="selectClass"
  >
    <option
      v-for="(option, index) in list"
      :key="index"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang='ts'>
// Modules
import { computed, toRefs, defineProps } from 'vue';
// Types
import {
  ISelectProps,
  SelectValue,
} from '@/types/selects';
// Store
import { useCommonStore } from '@/store';

// Props
const props = withDefaults(defineProps<ISelectProps>(), {
  list: () => ([]),
});

const { list } = toRefs(props);

// Model
const model = defineModel<SelectValue>();

// Data
const commonStore = useCommonStore();

// Computed
const selectClass = computed((): string[] => [
  'border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400',
  commonStore.theme === 'dark' ? 'focus:ring-blue-300 bg-gray-800 text-white border-gray-600' : 'focus:ring-blue-400 bg-white text-gray-800 border-gray-300',
]);
</script>