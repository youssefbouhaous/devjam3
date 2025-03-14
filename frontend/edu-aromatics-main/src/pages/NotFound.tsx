
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <div className="text-center max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <FileWarning className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold">Page not found</h1>
        
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="pt-4">
          <Button asChild className="button-effect">
            <Link to="/">
              Return to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
