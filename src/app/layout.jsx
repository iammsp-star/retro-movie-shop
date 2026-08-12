import './globals.css';
import { StoreProvider } from '@/lib/store';

export const metadata = {
  title: '3D Retro VHS Video Store | R3F & GSAP Experience',
  description: 'Step inside an interactive 3D Retro VHS Video Store built with Next.js, React Three Fiber, GSAP camera animations, and TMDB movie data.',
  keywords: ['3D Video Store', 'React Three Fiber', 'Three.js', 'Next.js', 'GSAP', 'VHS Retro Movie'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-retro-dark text-white antialiased selection:bg-retro-neonPink selection:text-white">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
