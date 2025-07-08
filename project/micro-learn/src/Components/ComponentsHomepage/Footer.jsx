// ✅ Footer.jsx
import Image from "next/image";

// Footer component displayed at the bottom of all pages
export default function Footer() {
  return (
    <footer className="footer">
      {/* Footer content: logo and copyright section */}
      <div className="footer-content flex-col md:flex-row items-center">
        {/* Logo section with icon and brand name */}
        <div className="footer-logo mb-4 md:mb-0">
          <Image src="/logo.png" alt="MicroLearn Logo" width={40} height={40} />
          <span className="footer-logo-text">MicroLearn</span>
        </div>
        {/* Dynamic copyright text */}
        <div className="copyright text-center md:text-left">
          © {new Date().getFullYear()} MicroLearn. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
