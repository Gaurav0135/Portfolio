export default function Footer() {
  return (
    <footer className="footer-animated border-t border-cyan-400/10 bg-[#02040b] px-4 py-6 text-center text-sm font-medium text-slate-400 sm:px-6">
      <p className="footer-copy">
        {/* © {new Date().getFullYear()} Gaurav Patel. Built with React, Tailwind CSS, and Node.js. */}
        © {new Date().getFullYear()} Gaurav Patel <br />
        Built with ❤️ using React & Tailwind CSS
      </p>
    </footer>
  );
}