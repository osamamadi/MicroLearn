// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutHeader from '../Components/ComponentsLayout/LayoutHeader';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MicroLearn - Short, Focused Video Lessons',
  description:
    'Catch up on missed lectures with short, focused 6-minute video lessons.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
        >
          <AuthProvider>
            <LayoutHeader />
            {/* ADDED: pt-20 to push content down, accounting for the fixed Navbar's height */}
            <main className="overflow-x-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen pt-20">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
  