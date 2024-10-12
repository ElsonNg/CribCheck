import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MasterControllerProvider } from "@/context/master-controller-context";


// Font files can be colocated inside of `app`
const sfProDisplayFont = localFont({
  src: [
    {
      path: '/fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/fonts/SF-Pro-Display-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '/fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '/fonts/SF-Pro-Display-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '/fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '/fonts/SF-Pro-Display-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '/fonts/SF-Pro-Display-Black.otf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '/fonts/SF-Pro-Display-BlackItalic.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
});


export const metadata: Metadata = {
  title: "CribCheck",
  description: "Find locations for your next crib!",
  icons: {
    icon: "/favicon.ico",
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sfProDisplayFont.className} antialiased bg-[#F9F9F9]`}
      >
        <MasterControllerProvider>
          {children}
        </MasterControllerProvider>
      </body>

    </html>
  );
}
