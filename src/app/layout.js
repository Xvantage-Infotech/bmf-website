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
      <body className="min-h-screen flex flex-col">
        <ClientOnly>
          <AuthProvider>
            <TooltipProvider>
              <DialogProvider>
                <Toaster />
                <Header />
                {/* main content now fully owns footer/mobile-nav logic */}
                <main className="flex-1">{children}</main>
              </DialogProvider>
            </TooltipProvider>
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}







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
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Meta Pixel Code */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               !function(f,b,e,v,n,t,s)
//               {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//               n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//               if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//               n.queue=[];t=b.createElement(e);t.async=!0;
//               t.src=v;s=b.getElementsByTagName(e)[0];
//               s.parentNode.insertBefore(t,s)}(window, document,'script',
//               'https://connect.facebook.net/en_US/fbevents.js');
//               fbq('init', 'YOUR_PIXEL_ID');
//               fbq('track', 'PageView');
//             `,
//           }}
//         />
//         <noscript>
//           <img
//             height="1"
//             width="1"
//             style={{ display: "none" }}
//             src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
//           />
//         </noscript>
//       </head>
//       <body className="min-h-screen flex flex-col">
//         <ClientOnly>
//           <AuthProvider>
//             <TooltipProvider>
//               <DialogProvider>
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
