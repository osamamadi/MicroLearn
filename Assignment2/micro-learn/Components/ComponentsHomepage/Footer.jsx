// ✅ Footer.jsx
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content flex-col md:flex-row items-center">
        <div className="footer-logo mb-4 md:mb-0">
          <Image src="/logo.png" alt="MicroLearn Logo" width={40} height={40} />
          <span className="footer-logo-text">MicroLearn</span>
        </div>
        <div className="copyright text-center md:text-left">
          © {new Date().getFullYear()} MicroLearn. All rights reserved.
        </div>
      </div>
    </footer>
  )
}