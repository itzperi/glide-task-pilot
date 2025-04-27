
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TaskState, Task, Priority, Status } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

type TaskAction =
  | { type: 'FETCH_TASKS_START' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_FAILURE'; payload: string }
  | { type: 'ADD_TASK_START' }
  | { type: 'ADD_TASK_SUCCESS'; payload: Task }
  | { type: 'ADD_TASK_FAILURE'; payload: string }
  | { type: 'UPDATE_TASK_START' }
  | { type: 'UPDATE_TASK_SUCCESS'; payload: Task }
  | { type: 'UPDATE_TASK_FAILURE'; payload: string }
  | { type: 'DELETE_TASK_START' }
  | { type: 'DELETE_TASK_SUCCESS'; payload: string }
  | { type: 'DELETE_TASK_FAILURE'; payload: string }
  | { type: 'SET_FILTER'; payload: { status?: Status | 'all'; priority?: Priority | 'all'; search?: string } };

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  loading: false,
  error: null,
  filter: {
    status: 'all',
    priority: 'all',
    search: '',
  },
};

// Mock data for initial tasks
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the proposal for the new client project',
    priority: 'high',
    status: 'todo',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review pull requests from team members',
    priority: 'medium',
    status: 'inprogress',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Update the project documentation with latest changes',
    priority: 'low',
    status: 'completed',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '4',
    title: 'Weekly team meeting',
    description: 'Prepare agenda for the weekly team meeting',
    priority: 'medium',
    status: 'todo',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
  {
    id: '5',
    title: 'Fix reported bugs',
    description: 'Address the bugs reported in the latest release',
    priority: 'high',
    status: 'inprogress',
    createdAt: new Date().toISOString(),
    userId: '1',
  },
];

// Filter tasks based on filter criteria
const filterTasks = (tasks: Task[], filter: TaskState['filter']) => {
  return tasks.filter(task => {
    const statusMatch = filter.status === 'all' || task.status === filter.status;
    const priorityMatch = filter.priority === 'all' || task.priority === filter.priority;
    const searchMatch = 
      filter.search === '' || 
      task.title.toLowerCase().includes(filter.search.toLowerCase()) || 
      task.description.toLowerCase().includes(filter.search.toLowerCase());
    
    return statusMatch && priorityMatch && searchMatch;
  });
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
    case 'ADD_TASK_START':
    case 'UPDATE_TASK_START':
    case 'DELETE_TASK_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        tasks: action.payload,
        filteredTasks: filterTasks(action.payload, state.filter),
        loading: false,
      };
    case 'ADD_TASK_SUCCESS':
      const newTasks = [...state.tasks, action.payload];
      return {
        ...state,
        tasks: newTasks,
        filteredTasks: filterTasks(newTasks, state.filter),
        loading: false,
      };
    case 'UPDATE_TASK_SUCCESS':
      const updatedTasks = state.tasks.map(task => 
        task.id === action.payload.id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: filterTasks(updatedTasks, state.filter),
        loading: false,
      };
    case 'DELETE_TASK_SUCCESS':
      const remainingTasks = state.tasks.filter(task => task.id !== action.payload);
      return {
        ...state,
        tasks: remainingTasks,
        filteredTasks: filterTasks(remainingTasks, state.filter),
        loading: false,
      };
    case 'FETCH_TASKS_FAILURE':
    case 'ADD_TASK_FAILURE':
    case 'UPDATE_TASK_FAILURE':
    case 'DELETE_TASK_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SET_FILTER':
      const newFilter = {
        ...state.filter,
        ...action.payload,
      };
      return {
        ...state,
        filter: newFilter,
        filteredTasks: filterTasks(state.tasks, newFilter),
      };
    default:
      return state;
  }
};

interface TaskContextProps {
  state: TaskState;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: Partial<TaskState['filter']>) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { state: authState } = useAuth();

  // Load tasks when authentication state changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchTasks();
    }
  }, [authState.isAuthenticated]);

  // Mock API fetch
  const fetchTasks = async () => {
    dispatch({ type: 'FETCH_TASKS_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would fetch from API
      // For now, use mock data
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: mockTasks });
    } catch (error) {
      dispatch({ type: 'FETCH_TASKS_FAILURE', payload: 'Failed to fetch tasks' });
      toast.error('Failed to fetch tasks');
    }
  };

  // Add a new task
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    dispatch({ type: 'ADD_TASK_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        userId: authState.user?.id || '1',
      };
      
      dispatch({ type: 'ADD_TASK_SUCCESS', payload: newTask });
      toast.success('Task added successfully');
    } catch (error) {
      dispatch({ type: 'ADD_TASK_FAILURE', payload: 'Failed to add task' });
      toast.error('Failed to add task');
    }
  };

  // Update an existing task
  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => {
    dispatch({ type: 'UPDATE_TASK_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const task = state.tasks.find(t => t.id === id);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      const updatedTask: Task = {
        ...task,
        ...updates,
      };
      
      dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: updatedTask });
      toast.success('Task updated successfully');
    } catch (error) {
      dispatch({ type: 'UPDATE_TASK_FAILURE', payload: 'Failed to update task' });
      toast.error('Failed to update task');
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    dispatch({ type: 'DELETE_TASK_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'DELETE_TASK_SUCCESS', payload: id });
      toast.success('Task deleted successfully');
    } catch (error) {
      dispatch({ type: 'DELETE_TASK_FAILURE', payload: 'Failed to delete task' });
      toast.error('Failed to delete task');
    }
  };

  // Set filter criteria
  const setFilter = (filter: Partial<TaskState['filter']>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  return (
    <TaskContext.Provider 
      value={{ 
        state, 
        fetchTasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        setFilter 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
