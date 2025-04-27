
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = ({ onAddTask }: { onAddTask: () => void }) => {
  const { logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">TaskPilot</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button onClick={onAddTask} variant="default">
            Add Task
          </Button>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
