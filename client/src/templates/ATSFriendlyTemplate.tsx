import { memo } from "react";
import type { ResumeData } from "../store/templateStore";

interface TemplateProps {
  data: ResumeData;
}

function ATSFriendlyTemplate({ data }: TemplateProps) {
  return (
    <article className="mx-auto w-full max-w-full rounded-xl border border-slate-300 bg-white p-5 text-slate-900">
      <header className="pb-3">
        <h2 className="text-2xl font-black tracking-tight">{data.name || "Your Name"}</h2>
        <p className="mt-1 text-sm text-slate-700">
          {[data.email, data.phone, data.address].filter(Boolean).join(" | ") || "your@email.com | +91 ..."}
        </p>
      </header>

      <section className="mt-4">
        <h3 className="text-sm font-extrabold uppercase">Summary</h3>
        <p className="mt-1 text-sm leading-6">{data.summary || "ATS optimized summary"}</p>
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-extrabold uppercase">Experience</h3>
        <p className="mt-1 whitespace-pre-line text-sm leading-6">{data.experience || "Experience"}</p>
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-extrabold uppercase">Skills</h3>
        <p className="mt-1 text-sm leading-6">{data.skills || "Skills"}</p>
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-extrabold uppercase">Education</h3>
        <p className="mt-1 whitespace-pre-line text-sm leading-6">{data.education || "Education"}</p>
      </section>
    </article>
  );
}

export default memo(ATSFriendlyTemplate);
