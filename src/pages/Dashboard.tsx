
import React, { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TaskCard from '@/components/TaskCard';
import TaskFormModal from '@/components/TaskFormModal';
import SearchBar from '@/components/SearchBar';
import { Task, Status } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

const Dashboard: React.FC = () => {
  const { state, addTask, updateTask, deleteTask } = useTasks();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  
  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };
  
  const handleStatusChange = (id: string, status: Status) => {
    updateTask(id, { status });
  };
  
  const confirmDeleteTask = (id: string) => {
    setTaskToDelete(id);
  };
  
  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const groupTasksByStatus = () => {
    const grouped = {
      todo: state.filteredTasks.filter(task => task.status === 'todo'),
      inprogress: state.filteredTasks.filter(task => task.status === 'inprogress'),
      completed: state.filteredTasks.filter(task => task.status === 'completed'),
    };
    
    return grouped;
  };
  
  const groupedTasks = groupTasksByStatus();
  
  return (
    <div className="flex flex-col h-screen">
      <Header onAddTask={handleAddTask} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <SearchBar />
          </div>
          
          {state.loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-lg">Loading tasks...</div>
            </div>
          ) : state.filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow animate-fade-in">
              <h3 className="text-xl font-medium mb-2">No tasks found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {state.tasks.length === 0 
                  ? "You haven't created any tasks yet."
                  : "No tasks match your current filters."}
              </p>
              <Button onClick={handleAddTask}>Create a new task</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                  <h2 className="font-semibold flex items-center">
                    <span className="bg-gray-400 w-3 h-3 rounded-full mr-2"></span>
                    To Do
                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                      {groupedTasks.todo.length}
                    </span>
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {groupedTasks.todo.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={confirmDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                  <h2 className="font-semibold flex items-center">
                    <span className="bg-status-inprogress w-3 h-3 rounded-full mr-2"></span>
                    In Progress
                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                      {groupedTasks.inprogress.length}
                    </span>
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {groupedTasks.inprogress.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={confirmDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                  <h2 className="font-semibold flex items-center">
                    <span className="bg-status-completed w-3 h-3 rounded-full mr-2"></span>
                    Completed
                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                      {groupedTasks.completed.length}
                    </span>
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {groupedTasks.completed.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={confirmDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <TaskFormModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        editTask={editingTask}
      />
      
      <AlertDialog open={taskToDelete !== null} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
