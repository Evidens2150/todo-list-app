import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import TaskList from '@/components/TaskList.vue'
import { useCommonStore } from '@/store'

// Мокаем i18n
const mockT = (key: string) => {
  const map: Record<string, string> = {
    'all': 'All',
    'active': 'Active',
    'completed': 'Completed',
    'searchPlaceholder': 'Search...'
  }
  return map[key] || key
}

describe('TaskList.vue', () => {
  let store: ReturnType<typeof useCommonStore>
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    const testingPinia = createTestingPinia()

    wrapper = mount(TaskList, {
      global: {
        plugins: [testingPinia],
        mocks: {
          $t: mockT,
        }
      }
    })

    store = useCommonStore()

    store.tasks = [
      { id: 1, title: 'Task 1', description: 'description 1', priority: 'middle', completed: false },
      { id: 2, title: 'Task 2', description: 'description 2', priority: 'middle', completed: true },
      { id: 3, title: 'Task 3', description: 'description 3', priority: 'middle', completed: false },
    ]

    await wrapper.vm.$nextTick()
  })

  it('renders tasks correctly', () => {
    const taskItems = wrapper.findAll('[data-testid="task-item"]')
    expect(taskItems.length).toBe(3)
    expect(taskItems[0].text()).toContain('Task 1')
  })

  it('filters tasks by search query', async () => {
    await wrapper.setData({ searchQuery: 'Task' })
    await wrapper.vm.$nextTick()
    
    let taskItems = wrapper.findAll('[data-testid="task-item"]')
    expect(taskItems.length).toBe(3)

    await wrapper.setData({ searchQuery: '2' })
    await wrapper.vm.$nextTick()
    
    taskItems = wrapper.findAll('[data-testid="task-item"]')
    expect(taskItems.length).toBe(1)
    expect(taskItems[0].text()).toContain('Task 2')
  })

  it('filters tasks by status', async () => {
    await wrapper.setData({ filterStatus: 'active' })
    await wrapper.vm.$nextTick()
    
    let activeTasks = wrapper.findAll('[data-testid="task-item"]')
    expect(activeTasks.length).toBe(2)
    
    await wrapper.setData({ filterStatus: 'completed' })
    await wrapper.vm.$nextTick()
    
    let completedTasks = wrapper.findAll('[data-testid="task-item"]')
    expect(completedTasks.length).toBe(1)
    
    await wrapper.setData({ filterStatus: '' })
  })

  it('handles pagination correctly', async () => {
    store.tasks.push(
      { id:4, title:'Task4', description:'desc4', priority:'middle', completed:false },
      { id:5, title:'Task5', description:'desc5', priority:'middle', completed:false },
      { id:6, title:'Task6', description:'desc6', priority:'middle', completed:false },
      { id:7, title:'Task7', description:'desc7', priority:'middle', completed:false },
      { id:8, title:'Task8', description:'desc8', priority:'middle', completed:false },
      { id:9, title:'Task9', description:'desc9', priority:'middle', completed:false },
      { id:10, title:'Task10', description:'desc10', priority:'middle', completed:false },
      { id:11, title:'Task11', description:'desc11', priority:'middle', completed:false }
    )

    await wrapper.vm.$nextTick()

    const taskItemsPage1 = wrapper.findAll('[data-testid="task-item"]')
    
    expect(taskItemsPage1.length).toBeLessThanOrEqual(10)

    const nextBtn = wrapper.find('[data-testid="pagination-next"]')

    if (nextBtn.exists() && !nextBtn.attributes('disabled')) {
      await nextBtn.trigger('click')
      await wrapper.vm.$nextTick()

      const currentPage = (wrapper.vm as any).currentPage?.value ?? null
      expect(currentPage).toBe(2)

      const taskItemsPage2 = wrapper.findAll('[data-testid="task-item"]')
      
      expect(taskItemsPage2.length).toBeGreaterThan(0)
      
      const backBtn = wrapper.find('[data-testid="pagination-back"]')
      
      expect(backBtn.attributes('disabled')).toBeUndefined()
      
      if (taskItemsPage1.length > 0 && taskItemsPage2.length > 0) {
        expect(taskItemsPage2[0].text()).not.toContain(taskItemsPage1[0].text())
      }
      
    } else {
      fail('Pagination next button not found or disabled')
    }
  })
})