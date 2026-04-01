import { memo } from "react";
import type { ResumeData } from "../store/templateStore";

interface TemplateProps {
  data: ResumeData;
}

function ProfessionalTemplate({ data }: TemplateProps) {
  return (
    <article className="mx-auto grid w-full max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-[240px_1fr]">
      <aside className="bg-slate-900 p-5 text-slate-100">
        {data.photoPreview && (
          <img src={data.photoPreview} alt="Profile" className="mb-4 h-28 w-28 rounded-lg object-cover" />
        )}
        <h2 className="text-xl font-bold">{data.name || "Your Name"}</h2>
        <p className="mt-1 text-sm text-slate-300">{data.email || "your@email.com"}</p>
        <p className="mt-1 text-sm text-slate-300">{data.phone || "+91 ..."}</p>
        <p className="mt-1 text-sm text-slate-300">{data.address || "Address"}</p>

        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-sky-300">Skills</h3>
          <p className="mt-2 text-sm leading-6 text-slate-200">{data.skills || "Skills"}</p>
        </div>
      </aside>

      <main className="p-5 text-slate-800">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Professional Summary</h3>
          <p className="mt-2 text-sm leading-6">{data.summary || "Professional summary"}</p>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Experience</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-6">{data.experience || "Experience"}</p>
        </section>

        <section className="mt-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Education</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-6">{data.education || "Education"}</p>
        </section>
      </main>
    </article>
  );
}

export default memo(ProfessionalTemplate);
