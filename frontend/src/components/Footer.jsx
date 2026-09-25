export default function Footer({ profile }) {
  return (
    <footer className="border-t border-slate-100 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} {profile?.name || "Srinjoy Mahanti"}. All rights reserved.</p>
        <p className="text-slate-400">Built with the MERN stack</p>
      </div>
    </footer>
  );
}
