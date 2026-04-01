export type TemplateCategory = "ATS Friendly" | "Professional" | "Creative" | "Minimal";

export interface ResumeTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  atsScore: number;
  premium: boolean;
  thumbnail: string;
  description: string;
}

const placeholder = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=900&q=70`;

export const templates: ResumeTemplate[] = [
  {
    id: "ats-clean-1",
    name: "ATS Clean Pro",
    category: "ATS Friendly",
    atsScore: 96,
    premium: false,
    thumbnail: placeholder("1486312338219-ce68e2c6b696"),
    description: "Machine-readable format optimized for applicant tracking systems."
  },
  {
    id: "pro-exec-1",
    name: "Executive Formal",
    category: "Professional",
    atsScore: 90,
    premium: true,
    thumbnail: placeholder("1507679799987-c73779587ccf"),
    description: "Balanced hierarchy and polished sections for leadership roles."
  },
  {
    id: "creative-pulse-1",
    name: "Creative Pulse",
    category: "Creative",
    atsScore: 80,
    premium: true,
    thumbnail: placeholder("1521790797524-b2497295b8a0"),
    description: "Strong visual impact for design, media, and product profiles."
  },
  {
    id: "minimal-light-1",
    name: "Minimal Light",
    category: "Minimal",
    atsScore: 92,
    premium: false,
    thumbnail: placeholder("1494790108377-be9c29b29330"),
    description: "Simple, elegant structure with no visual clutter."
  },
  {
    id: "ats-modern-2",
    name: "ATS Modern Grid",
    category: "ATS Friendly",
    atsScore: 95,
    premium: false,
    thumbnail: placeholder("1461749280684-dccba630e2f6"),
    description: "ATS-focused layout with clear chronology and skill grouping."
  },
  {
    id: "pro-consult-2",
    name: "Consulting Edge",
    category: "Professional",
    atsScore: 91,
    premium: false,
    thumbnail: placeholder("1484154218962-a197022b5858"),
    description: "Data-forward layout ideal for consulting and strategy roles."
  },
  {
    id: "creative-brand-2",
    name: "Brand Canvas",
    category: "Creative",
    atsScore: 82,
    premium: false,
    thumbnail: placeholder("1484863137850-59afcfe05386"),
    description: "Distinctive typography and spacing for brand storytelling."
  },
  {
    id: "minimal-core-2",
    name: "Core Minimal",
    category: "Minimal",
    atsScore: 93,
    premium: true,
    thumbnail: placeholder("1469474968028-56623f02e42e"),
    description: "Refined one-column template with elegant section rhythm."
  },
  {
    id: "pro-tech-3",
    name: "Tech Professional",
    category: "Professional",
    atsScore: 94,
    premium: true,
    thumbnail: placeholder("1454165804606-c3d57bc86b40"),
    description: "Built for engineering and product applicants with clear impact bullets."
  },
  {
    id: "ats-classic-3",
    name: "ATS Classic",
    category: "ATS Friendly",
    atsScore: 97,
    premium: false,
    thumbnail: placeholder("1460925895917-afdab827c52f"),
    description: "Conservative but high-performing ATS layout for all industries."
  },
  {
    id: "creative-lite-3",
    name: "Creative Lite",
    category: "Creative",
    atsScore: 78,
    premium: false,
    thumbnail: placeholder("1445053023192-8d45cb66099d"),
    description: "Color-led design that still keeps hiring details prominent."
  },
  {
    id: "minimal-pro-3",
    name: "Minimal Pro",
    category: "Minimal",
    atsScore: 94,
    premium: true,
    thumbnail: placeholder("1498050108023-c5249f4df085"),
    description: "Quiet premium look with ATS-friendly section ordering."
  }
];

export interface TemplateApiResponse {
  data: ResumeTemplate[];
  hasMore: boolean;
}

// Mock API: simulates paginated backend calls for production-like flow.
export const fetchTemplates = async (
  page: number,
  pageSize = 6
): Promise<TemplateApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 550));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = templates.slice(start, end);

  return {
    data,
    hasMore: end < templates.length
  };
};