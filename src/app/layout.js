// import '../styles/globals.css';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen flex flex-col">
//         <ClientOnly>
//           <AuthProvider>
//             <TooltipProvider>
//               <DialogProvider>
//                 {" "}
//                 {/* ✅ Wrap everything */}
//                 <Toaster />
//                 <Header />
//                 <main className="flex-1">{children}</main>
//                 <Footer />
//                 <MobileBottomNav />
//               </DialogProvider>
//             </TooltipProvider>
//           </AuthProvider>
//         </ClientOnly>
//       </body>
//     </html>
//   );
// }



// import "../../styles/globals.css";
// import { suppressConsoleLogsInProd } from "@/lib/utils";
// suppressConsoleLogsInProd(); 
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { AuthProvider } from "@/contexts/AuthContext";
// import { DialogProvider } from "@/hooks/use-dialog";
// import MobileBottomNav from "@/components/Layout/MobileBottomNav";
// import Footer from "@/components/Layout/Footer";
// import Header from "@/components/Layout/Header";
// import ClientOnly from "@/components/Clientonly/ClientOnly";

// export const metadata = {
//   title: "BookMyFarm",
//   description: "Book farms seamlessly",
//   icons: {
//     icon: '/favicon.ico',
//   },
// };


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen flex flex-col">
//         <ClientOnly>
//           <AuthProvider>
//             <TooltipProvider>
//               <DialogProvider>
//                 <Toaster />
//                 <Header />
//                 {/* main content now fully owns footer/mobile-nav logic */}
//                 <main className="flex-1">{children}</main>
//               </DialogProvider>
//             </TooltipProvider>
//           </AuthProvider>
//         </ClientOnly>
//       </body>
//     </html>
//   );
// }







import "../../styles/globals.css";
import { suppressConsoleLogsInProd } from "@/lib/utils";
suppressConsoleLogsInProd(); 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/hooks/use-dialog";
import MobileBottomNav from "@/components/Layout/MobileBottomNav";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ClientOnly from "@/components/Clientonly/ClientOnly";
import FacebookPixel from "@/components/MetaPixel/FacebookPixel";

export const metadata = {
  title: "BookMyFarm",
  description: "Book farms seamlessly",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
       
      </head>
      <body className="min-h-screen flex flex-col">
         <FacebookPixel />
        <ClientOnly>
          <AuthProvider>
            <TooltipProvider>
              <DialogProvider>
                <Toaster />
                <Header />
                <main className="flex-1">{children}</main>
               
              </DialogProvider>
            </TooltipProvider>
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
