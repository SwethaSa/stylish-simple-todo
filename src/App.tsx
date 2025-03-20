
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.title = "My Future";
    
    // Add meta theme-color for mobile browser UI
    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#0a0a12';
    document.head.appendChild(metaThemeColor);
    
    return () => {
      document.head.removeChild(metaThemeColor);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="app-container min-h-screen overflow-hidden">
          <Toaster />
          <Sonner 
            theme="dark"
            position="top-right"
            className="space-theme-toasts"
            toastOptions={{
              style: {
                background: 'rgba(10, 10, 30, 0.8)',
                color: '#fff',
                border: '1px solid rgba(0, 200, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
