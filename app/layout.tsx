import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MasterControllerProvider } from "@/context/master-controller-context";
import Script from "next/script";


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

                {/* Google Maps bootstrap ONLY (no pre-import) */}
                <Script id="google-maps-bootstrap" strategy="beforeInteractive">
                    {`(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;
b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,
u=()=>h||(h=new Promise(async(f,n)=>{
  await (a=m.createElement("script"));
  e.set("key","${process.env.NEXT_PUBLIC_GOOGLE_PLACES_MAP_API}");
  e.set("v","weekly");
  for(k in g) e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);
  e.set("callback",c+".maps."+q);
  a.src=\`https://maps.googleapis.com/maps/api/js?\`+e;
  d[q]=f;
  a.onerror=()=>h=n(Error(p+" could not load."));
  a.nonce=m.querySelector("script[nonce]")?.nonce||"";
  m.head.append(a);
}));
d[l]?console.warn(p+" only loads once. Ignoring:",g):
d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({});`}
                </Script>
            </body>
        </html>
    );
}
