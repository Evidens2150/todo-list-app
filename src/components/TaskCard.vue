<template>
  <div class="p-[10px] border border-gray-300 rounded flex items-start justify-between shadow-sm hover:shadow-md transition-shadow duration-200 w-full flex-col gap-2">
    <div class="flex justify-between w-full gap-4">
      <input
        v-if="isEditMode"
        v-model="editTitle"
        class="border border-gray-300 rounded flex-grow px-3 focus:outline-none focus:ring focus:ring-blue-400"
      />
      <p
        v-else
        class="text-xl font-semibold"
      >
        {{ title }}
      </p>
      <v-button
        v-if="!completed"
        color="secondary"
        :title="$t('rename')"
        @click="handleEditButton"
      >
        <check-icon v-if="isEditMode"/>
        <edit-icon v-else/>
      </v-button>
    </div>
    <p v-if="description">
      {{ description }}
    </p>
    <p>
      {{ $t('priorityTitle') }}: 
      <span :class="priorityClass">
        {{ t(`${priority}TaskPriority`) }}
      </span>
    </p>
    <p :class="completeStatusClass">
      {{ completeStatusTitle }}
    </p>
    <div class="flex gap-4">
      <v-button
        v-if="completed"
        color="secondary"
        :title="t('restoreTask')"
        @click="toggleCompleteTask"
      >
        <remove-done-icon/>
      </v-button>
      <v-button
        v-else
        color="success"
        :title="t('setTaskCompleted')"
        @click="toggleCompleteTask"
      >
        <done-icon/>
      </v-button>

      <v-button
        color="danger"
        :title="$t('delete')"
        @click="handleDeleteTask"
      >
        <trash-icon/>
      </v-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
// Modules
import { ref, computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification'
// Components
import VButton from "@/components/common/VButton.vue";
import CheckIcon from '@/components/common/icons/CheckIcon.vue';
import EditIcon from '@/components/common/icons/EditIcon.vue';
import DoneIcon from '@/components/common/icons/DoneIcon.vue';
import RemoveDoneIcon from '@/components/common/icons/RemoveDoneIcon.vue';
import TrashIcon from '@/components/common/icons/TrashIcon.vue';
// Types
import { ITaskData } from '@/types/tasks';
// Store
import { useCommonStore } from '@/store';

// Props
const props = defineProps<ITaskData>();

const {
  id,
  title,
  description,
  completed,
  priority
} = toRefs(props);

// Data
const commonStore = useCommonStore();
const { t } = useI18n();
const notification = useToast();
const isEditMode = ref<boolean>(false);
const editTitle = ref<string>(title.value);

// Computed
const completeStatusTitle = computed((): string => 
  completed.value ? t('taskCompleted') : t('taskNotCompleted')
);

const completeStatusClass = computed((): string =>
  completed.value ? 'text-green-700' : 'text-red-700'
);

const priorityClass = computed((): string => {
  switch (priority.value) {
    case 'medium':
      return 'text-yellow-500';
    case 'high':
      return 'text-red-700';
    default:
      return 'text-green-700';
  }
});

// Methods
const handleEditButton = () => {
  if (!isEditMode.value) {
    isEditMode.value = true;
    return;
  }

  commonStore.updateTask(id.value, editTitle.value);
  isEditMode.value = false;
};

const toggleCompleteTask = () => {
  commonStore.toggleComplete(id.value, !completed.value);

  if (!completed.value) {
    notification.success(t('taskNotificationSuccess', { name: title.value }));
    return;
  }

  notification.info(t('taskNotificationDismiss', { name: title.value }));
};

const handleDeleteTask = () => {
  commonStore.deleteTask(id.value);
};
</script>