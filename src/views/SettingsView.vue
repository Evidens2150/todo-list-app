<template>
  <div class="flex flex-col items-center gap-4">
    
    <div class="flex gap-2">
      <v-select
        v-model="currentAppLanguage"
        :list="languageOptionList"
      />      
    </div>

    <div class="flex gap-2">
      <v-button
        v-for="(theme, index) in themeList"
        :key="index"
        color="custom"
        :class="getThemeButtonClass(theme.value as AppTheme)"
        :disabled="currentAppTheme === theme.value"
        @click="handleChangeTheme(theme.value as AppTheme)"
      >
        {{ theme.label }}
      </v-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Modules
import { computed } from "vue";
import { useI18n } from 'vue-i18n';
// Components
import VSelect from "@/components/common/VSelect.vue";
import VButton from "@/components/common/VButton.vue";
// Types
import { ISelectOption } from '@/types/selects';
import { AppTheme, AppLanguage } from '@/types/common';
// Store
import { useCommonStore } from '@/store';

// Data
const commonStore = useCommonStore();
const { t } = useI18n();

// Computed
const currentAppLanguage = computed({
  get(): AppLanguage {
    return commonStore.language
  },
  set(currentLanguage: AppLanguage) {
    commonStore.setAppLanguage(currentLanguage);
  }
});

const languageOptionList = computed((): ISelectOption[] => [
  {
    label: 'Русский',
    value: 'ru',
  },
  {
    label: 'English',
    value: 'en',
  },
]);

const currentAppTheme = computed((): AppTheme => commonStore.theme);

const themeList = computed((): ISelectOption[] => [
  {
    label: t('light'),
    value: 'light',
  },
  {
    label: t('dark'),
    value: 'dark',
  },
]);

// Methods
const handleChangeTheme = (currentTheme: AppTheme) => {
  commonStore.setAppTheme(currentTheme);
};

const getThemeButtonClass = (currentTheme: AppTheme) => ([
  'border not-disabled:hover:opacity-70',
  currentTheme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'
]);
</script>
