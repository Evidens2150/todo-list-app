<template>
  <div :class="themeClass">
    <nav class="flex justify-center gap-1.5 pb-6">
      <div
        v-for="(route, index) in routeList"
        :key="index"
        class="flex items-center gap-1.5"
      >
        <span v-if="index">|</span>
        <router-link
          :to="route.path"
          class="underline font-semibold"
          active-class="text-blue-500"
        >
          {{ route.title }}
        </router-link>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script setup lang='ts'>
// Modules
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
// Store
import { useCommonStore } from '@/store';

// Data
const commonStore = useCommonStore();
const { t } = useI18n();

// Computed
const routeList = computed((): Record<string, string>[] => [
  {
    path: '/',
    title: t('homePage'),
  },
  {
    path: '/settings',
    title: t('settingsPage'),
  },
  {
    path: '/about',
    title: t('aboutPage'),
  },
]);

const themeClass = computed(()=> [
  'min-h-screen transition-colors duration-300 text-gray-800 p-4 max-w-[1200px] mx-auto',
  commonStore.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
]);
</script>
