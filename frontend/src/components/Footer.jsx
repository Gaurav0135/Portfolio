export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm font-medium text-slate-500">
      © {new Date().getFullYear()} Gaurav Patel. Built with React, Tailwind CSS, and Node.js.
    </footer>
  );
}