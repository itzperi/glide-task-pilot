
import React from 'react';
import { Task } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const priorityColors = {
    low: 'bg-priority-low',
    medium: 'bg-priority-medium',
    high: 'bg-priority-high',
  };
  
  const statusLabels = {
    todo: 'To Do',
    inprogress: 'In Progress',
    completed: 'Completed',
  };
  
  const statusColors = {
    todo: 'bg-status-todo',
    inprogress: 'bg-status-inprogress',
    completed: 'bg-status-completed',
  };
  
  const getNextStatus = (currentStatus: Task['status']): Task['status'] => {
    switch (currentStatus) {
      case 'todo':
        return 'inprogress';
      case 'inprogress':
        return 'completed';
      case 'completed':
        return 'todo';
      default:
        return 'todo';
    }
  };
  
  return (
    <Card className="task-card hover:translate-y-[-2px] group">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg line-clamp-1">{task.title}</h3>
          <div className="flex space-x-1">
            <span className={`priority-badge ${priorityColors[task.priority]}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
          {task.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 italic">
            Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </span>
          
          <button
            className={`text-xs rounded-full px-2 py-1 text-white ${statusColors[task.status]}`}
            onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
          >
            {statusLabels[task.status]}
          </button>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
