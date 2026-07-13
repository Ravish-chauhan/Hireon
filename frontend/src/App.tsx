import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AppRoutes from './routes/AppRoutes';
import FloatingActionButton from './components/common/FloatingActionButton';
import { LeadFormPopup } from './components/common/LeadFormPopup';
import SubscriptionTester from './components/dev/SubscriptionTester';
import { ScrollToTop } from './components/common/ScrollToTop';
import Lenis from 'lenis';

function App() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Expose lenis globally so ScrollToTop can use it
    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Listen for contact form trigger
    const handleContactTrigger = () => setIsContactFormOpen(true)
    window.addEventListener('openContactForm', handleContactTrigger)

    return () => {
      lenis.destroy();
      delete (window as any).__lenis;
      window.removeEventListener('openContactForm', handleContactTrigger)
    };
  }, []);

  return (
    <HelmetProvider>
      <Router>
      <AuthProvider>
        <UserProvider>
          <div className="App min-h-screen">
            <ScrollToTop />
            <AppRoutes />
            <FloatingActionButton />
            <LeadFormPopup 
              isContactTriggered={isContactFormOpen} 
              onContactClose={() => setIsContactFormOpen(false)} 
            />
            {/* <SubscriptionTester /> */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0A2647',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#FF9D42',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </UserProvider>
      </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;