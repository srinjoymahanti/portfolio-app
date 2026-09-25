import SectionHeading from "../components/SectionHeading.jsx";

export default function About({ profile }) {
  return (
    <section id="about" className="py-20 px-5 sm:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="About Me" title="A bit about who I am" />
        <p className="text-slate-600 leading-relaxed text-center">
          {profile?.bio ||
            "IT engineering student and aspiring full-stack web developer."}
        </p>
      </div>
    </section>
  );
}
