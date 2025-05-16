import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AppTheme, AppLanguage } from '@/types/common';
import { ITaskData } from '@/types/tasks';
import { useI18n } from 'vue-i18n';

export const useCommonStore = defineStore('commonStore', () => {
  // State
  const tasks = ref<ITaskData[]>([]);
  const theme = ref<AppTheme>('light');
  const language = ref<AppLanguage>('ru');
  const { locale } = useI18n();

  // Actions
  const addTask = (task: ITaskData) => {
    tasks.value.push(task)
    saveTaskListToLocalStorage()
  };

  const deleteTask = (id: number) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveTaskListToLocalStorage()
  };

  const toggleComplete = (id: number, newCompletedStatus: boolean) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.completed = newCompletedStatus;
      saveTaskListToLocalStorage()
    }
  };

  const updateTask = (id: number, newTitle: string) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.title = newTitle
      saveTaskListToLocalStorage()
    }
  };

  const saveTaskListToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  };

  const loadTaskListFromLocalStorage = () => {
    const data = localStorage.getItem('tasks')
    if (data) {
      tasks.value = JSON.parse(data)
    }
  };

  const setAppTheme = (currentTheme: AppTheme) => {
    theme.value = currentTheme;
    localStorage.setItem('theme', JSON.stringify(currentTheme));
  };

  const loadAppThemeFromLocalStorage = () => {
    const data = localStorage.getItem('theme');
    if (data) {
      theme.value = JSON.parse(data)
    }
  };

  const setAppLanguage = (currentLanguage: AppLanguage) => {
    locale.value = currentLanguage;
    language.value = currentLanguage;
    localStorage.setItem('lang', JSON.stringify(currentLanguage));
  };

  const loadAppLanguageFromLocalStorage = () => {
    const data = localStorage.getItem('lang');
    if (data) {
      language.value = JSON.parse(data);
      locale.value = language.value;
    }
  };

  const initStorage = () => {
    loadTaskListFromLocalStorage();
    loadAppThemeFromLocalStorage();
    loadAppLanguageFromLocalStorage();
  };

  initStorage();

  return {
    // State
    tasks,
    theme,
    language,

    // Actions
    addTask,
    deleteTask,
    toggleComplete,
    updateTask,
    setAppTheme,
    setAppLanguage,
  };
});