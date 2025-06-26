
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import MobileBottomNav from '@/components/Layout/MobileBottomNav';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import '../styles/globals.css';

export const metadata = {
  title: 'BookMyFarm',
  description: 'Book farms seamlessly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
            </TooltipProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
