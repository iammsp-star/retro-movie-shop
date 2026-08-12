import "./globals.css";

export const metadata = {
  title: "Retro Movie Shop 3D | Virtual VHS Vault",
  description: "3D Virtual Video Rental Store built with Next.js, React Three Fiber, GSAP, and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-950 text-white">{children}</body>
    </html>
  );
}
