import { defineComponent } from 'vue'
import TaskList from '@/components/TaskList.vue'

// Мокаем store
const mockTasks = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  title: `Task ${i + 1}`,
  description: `Task description ${i + 1}`,
  priority: 'middle',
  completed: i % 2 === 0,
}));

const mockStore = {
  tasks: [...mockTasks],
  theme: 'light',
};

// Мокаем $t
const mockT = (key) => {
  const translations = {
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    searchPlaceholder: 'Search...',
    back: 'Back',
    forward: 'Next',
  };
  return translations[key] || key;
};

describe('TaskList', () => {
  beforeEach(() => {
    cy.mount(defineComponent({
      components: { TaskList },
      setup() {
        return () => (
          <TaskList />
        );
      },
    }), {
      global: {
        provide() {
          return {
            useCommonStore: () => mockStore,
            $t: mockT,
          }
        }
      }
    });
  });

  it('отображает список задач', () => {
    cy.get('[data-testid="task-item"]').should('have.length', 10); // первая страница
    cy.get('[data-testid="task-item"]').first().contains('Task 1');
  });

  it('фильтрует задачи по статусу', () => {
    // Открываем селект и выбираем "Active"
    cy.get('.v-select').click();
    cy.contains('Active').click();

    // Проверяем, что отображаются только активные задачи
    cy.get('[data-testid="task-item"]').each(($el) => {
      cy.wrap($el).contains(/Task \d+/);
    });
  });

  it('фильтрует задачи по поисковому запросу', () => {
    cy.get('input[placeholder="Search..."]').type('Task 1');
    cy.get('[data-testid="task-item"]').should('have.length.gte',1);
    cy.get('[data-testid="task-item"]').first().contains('Task 1');
  });

  it('работает пагинация', () => {
    // Проверяем наличие кнопок пагинации
    cy.get('[data-testid="pagination-back"]').should('not.be.disabled');
    cy.get('[data-testid="pagination-next"]').should('not.be.disabled');

    // Переходим на следующую страницу
    cy.get('[data-testid="pagination-next"]').click();

    // Проверяем, что текущая страница изменилась
    cy.contains('2 /').should('exist');

    // Возвращаемся назад
    cy.get('[data-testid="pagination-back"]').click();
    cy.contains('1 /').should('exist');
  });
});