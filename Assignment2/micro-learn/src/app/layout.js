// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutHeader from '../../Components/ComponentsLayout/LayoutHeader';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MicroLearn - Short, Focused Video Lessons',
  description: 'Catch up on missed lectures with short, focused 6-minute video lessons.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap the entire body content with AuthProvider */}
        <AuthProvider>
          <LayoutHeader />
          <main className="overflow-x-hidden">{children}</main>
        </AuthProvider>
        
      </body>
    </html>
  );
}
