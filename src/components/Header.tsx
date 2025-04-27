
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Plus, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  onAddTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
  const { state, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b py-4 px-6 flex items-center justify-between animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">TaskPilot</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        {state.isAuthenticated && (
          <>
            <Button 
              onClick={onAddTask} 
              className="flex items-center gap-1"
              variant="default"
            >
              <Plus className="h-4 w-4" />
              <span>New Task</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                3
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8">
                  <div className="rounded-full bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-sm font-medium">
                    {state.user?.name.charAt(0)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
