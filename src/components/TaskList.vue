<template>
  <div class="mb-[70px]">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2 md:flex-nowrap">
      <div class="flex space-x-2">
        <v-select
          v-model="filterStatus"
          :list="taskStatusOptionList"
          :disabled="isTaskListEmpty"
        />
      </div>

      <input
        v-model="searchQuery"
        :placeholder="$t('searchPlaceholder')"
        :disabled="isTaskListEmpty"
        class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400 w-full md:flex-grow"
      />

      <task-create />
    </div>

    <ul class="space-y-[10px] mb-[20px]">
      <li
        v-for="task in paginatedTasks"
        :key="task.id"
        data-testid="task-item"
      >
        <task-card v-bind="task" />
      </li>
    </ul>

    <div
      v-if="isPagination"
      :class="paginationClass"
    >
      <v-button
        :disabled='currentPage===1'
        color="secondary"
        class='border border-gray-300 px-[8px] py-[4px] rounded hover:bg-gray-'
        :class="{ 'opacity-[0.5]' : currentPage===1 }"
        data-testid="pagination-back"
        @click='handlePrev'
      >
        {{ $t('back') }}
      </v-button>
      <span>
        {{ currentPage }} / {{ totalPages }}
      </span>
      <v-button
        :disabled='currentPage===totalPages'
        color="secondary"
        class='border border-gray-300 px-[8px] py-[4px] rounded hover:bg-gray-'
        :class="{ 'opacity-[0.5]' : currentPage===totalPages }"
        data-testid="pagination-next"
        @click='handleNext'
      >
      {{ $t('forward') }}
      </v-button>
    </div>

  </div>
</template>

<script setup lang='ts'>
// Modules
import { ref, computed, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
// Components
import TaskCreate from "@/components/TaskCreate.vue";
import TaskCard from "@/components/TaskCard.vue";
import VButton from "@/components/common/VButton.vue";
import VSelect from "@/components/common/VSelect.vue";
// Types
import {
  TaskStatus,
  ITaskData,
  ITaskStatusOption,
} from '@/types/tasks';
// Store
import { useCommonStore } from '@/store';

// Data
const commonStore = useCommonStore();
const { t } = useI18n();
const searchQuery = ref<string>('')
const filterStatus = ref<TaskStatus>('all')
const currentPage = ref<number>(1);
const pageSize: number = 10;
const taskStatusOptionList = computed((): ITaskStatusOption[] => [
  {
    label: t('all'),
    value: 'all',
  },
  {
    label: t('active'),
    value: 'active',
  },
  {
    label: t('completed'),
    value: 'completed',
  },
]);

// Computed
const taskList = computed((): ITaskData[] => commonStore.tasks.reverse())

const filteredTasks = computed((): ITaskData[] => {
  if (filterStatus.value !== 'all') {
    return taskList.value.filter(t => filterStatus.value==='active'? !t.completed : t.completed);
  }

  if (!!searchQuery.value.trim()) {
    return taskList.value.filter(t => t.title.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }
  
  return taskList.value;
});

const totalPages = computed((): number => Math.ceil(filteredTasks.value.length / pageSize));

const paginatedTasks = computed((): ITaskData[] => {
  const startIdx = (currentPage.value -1) * pageSize
  return filteredTasks.value.slice(startIdx,startIdx+pageSize)
});

const isTaskListEmpty = computed((): boolean => !commonStore.tasks?.length);

const isPagination = computed((): boolean => totalPages.value > 1);

const paginationClass = computed((): string[] => [
  'flex justify-center space-x-[8px] fixed bottom-0 left-0 w-full p-4',
  commonStore.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
]);

// Methods
const handleNext = () => {
  if (currentPage.value< totalPages.value) currentPage.value += 1;
};

const handlePrev = () => {
  if (currentPage.value>1) currentPage.value -= 1;
};

defineExpose({
  currentPage,
});
</script>

