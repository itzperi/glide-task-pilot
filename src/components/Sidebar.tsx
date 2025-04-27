
import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Status, Priority } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { List, Calendar, CheckSquare, X, ArrowRight } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { state, setFilter } = useTasks();
  
  const statusFilters: { label: string; value: Status | 'all'; icon: React.ReactNode }[] = [
    { label: 'All Tasks', value: 'all', icon: <List className="h-4 w-4" /> },
    { label: 'To Do', value: 'todo', icon: <ArrowRight className="h-4 w-4" /> },
    { label: 'In Progress', value: 'inprogress', icon: <Calendar className="h-4 w-4" /> },
    { label: 'Completed', value: 'completed', icon: <CheckSquare className="h-4 w-4" /> },
  ];
  
  const priorityFilters: { label: string; value: Priority | 'all'; color: string }[] = [
    { label: 'All Priorities', value: 'all', color: 'bg-gray-400' },
    { label: 'Low', value: 'low', color: 'bg-priority-low' },
    { label: 'Medium', value: 'medium', color: 'bg-priority-medium' },
    { label: 'High', value: 'high', color: 'bg-priority-high' },
  ];
  
  return (
    <aside className={`
      bg-white dark:bg-gray-800 border-r h-[calc(100vh-64px)] p-4
      transition-all duration-300 ease-in-out
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="flex justify-end mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ArrowRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>
      
      {!collapsed && (
        <>
          <h2 className="text-sm font-semibold mb-2 text-gray-500">FILTER BY STATUS</h2>
          <nav className="space-y-1 mb-6">
            {statusFilters.map((item) => (
              <Button
                key={item.value}
                variant={state.filter.status === item.value ? 'default' : 'ghost'}
                className={`w-full justify-start ${state.filter.status === item.value ? '' : 'text-muted-foreground'}`}
                onClick={() => setFilter({ status: item.value })}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav>
          
          <Separator className="my-4" />
          
          <h2 className="text-sm font-semibold mb-2 text-gray-500">FILTER BY PRIORITY</h2>
          <div className="space-y-1">
            {priorityFilters.map((item) => (
              <Button
                key={item.value}
                variant={state.filter.priority === item.value ? 'default' : 'ghost'}
                className={`w-full justify-start ${state.filter.priority === item.value ? '' : 'text-muted-foreground'}`}
                onClick={() => setFilter({ priority: item.value })}
              >
                <span className={`h-3 w-3 rounded-full ${item.color} mr-2`}></span>
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        </>
      )}
      
      {collapsed && (
        <div className="flex flex-col items-center space-y-4 mt-4">
          {statusFilters.map((item) => (
            <Button
              key={item.value}
              variant={state.filter.status === item.value ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setFilter({ status: item.value })}
              title={item.label}
            >
              {item.icon}
            </Button>
          ))}
          
          <Separator className="my-2 w-full" />
          
          {priorityFilters.slice(1).map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${state.filter.priority === item.value ? 'border-2 border-primary' : ''}`}
              onClick={() => setFilter({ priority: item.value })}
              title={item.label}
            >
              <span className={`h-3 w-3 rounded-full ${item.color}`}></span>
            </Button>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
