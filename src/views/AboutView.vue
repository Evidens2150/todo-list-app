<template>
  <section class="p-6 mx-auto my-8">
    <h2 class="text-2xl font-semibold mb-4">
      {{ $t('mainTechnologies') }}
    </h2>
    <ul class="list-disc list-inside space-y-2">
      <li v-for="(tech, index) in technologies" :key="index">
        <strong>{{ tech }}</strong> — {{ $t(`technologies.${tech}`) }}
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
// Modules
import { computed } from "vue";
import ru from '@/locales/ru.json';

// Computed
const technologies = computed<string[]>(() => Object.keys(ru.technologies) );
</script>