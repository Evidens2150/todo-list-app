<template>
  <div>
    <v-button
      :title="$t('addTask')"
      @click="openModal"
    >
      <add-icon/>
    </v-button>

    <teleport to="body" v-if="isOpen">
      <div
        :class="overlayClass"
        @click.self="closeModal"
      >
        <div :class="modalClass">
          <h2 class="text-xl font-semibold mb-4">
            {{ $t("addTask") }}
          </h2>
          <form
            class="flex flex-col gap-3"
            @submit.prevent
            >
            <input
              v-model="title"
              :placeholder="$t('taskName')"
              class="border  rounded flex-grow px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              :class="[!title ? 'border-red-300' : 'border-gray-300']"
            />
            <textarea
              v-model="description"
              :placeholder="$t('taskDescription')"
              class="border border-gray-300 rounded flex-grow px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <v-select
              v-model="priority"
              :list="taskPriorityOptionList"
            />
            <div class="flex justify-end gap-2 mt-4">
              <v-button
                type="submit"
                :disabled="!title"
                @click="submit"
              >
                {{ $t("add") }}
              </v-button>
              <v-button
                color="secondary"
                @click="closeModal"
              >
                {{ $t("cancel") }}
              </v-button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
// Modules
import { ref, computed } from "vue";
import { useI18n } from 'vue-i18n'
// Components
import VButton from "@/components/common/VButton.vue";
import VSelect from "@/components/common/VSelect.vue";
import AddIcon from '@/components/common/icons/AddIcon.vue';
// Types
import { TaskPriority } from '@/types/tasks';
import { ISelectOption } from '@/types/selects';
// Store
import { useCommonStore } from '@/store';

// Data
const commonStore = useCommonStore();
const { t } = useI18n()
const isOpen = ref<boolean>(false);
const title = ref<string>("");
const description = ref<string>("");
const priority = ref<TaskPriority>("medium");

// Computed
const taskPriorityOptionList = computed((): ISelectOption[] => [
  {
    label: t('lowTaskPriority'),
    value: 'low',
  },
  {
    label: t('mediumTaskPriority'),
    value: 'medium',
  },
  {
    label: t('highTaskPriority'),
    value: 'high',
  },
]);

const overlayClass = computed((): string[] => [
  'fixed inset-0 bg-opacity-50 flex justify-center items-center z-50',
  commonStore.theme === 'dark' ? 'bg-gray-500/50' : 'bg-black/50',
]);

const modalClass = computed((): string[] => [
  'border border-gray-300 rounded-lg shadow-lg p-6 w-full max-w-md',
  commonStore.theme === 'dark' ? 'text-white bg-gray-800' : 'bg-white',
]);

// Methods
const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  title.value = "";
};

const submit = () => {
  commonStore.addTask({
    id: Date.now(),
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    completed: false,
  })
  closeModal();
};
</script>
