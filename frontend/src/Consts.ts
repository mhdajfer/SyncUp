export const BASIC_URL = "http://localhost:3001";

export const ProjectData = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of the company's website to improve UX/UI.",
    managerId: "64f4f16e1d2b7b4b5c6f6e7f",
    start_date: "2023-07-01T00:00:00Z",
    due_date: "2023-12-01T00:00:00Z",
    status: "in progress",
    task_ids: ["64f4f16e1d2b7b4b5c6f6e80", "64f4f16e1d2b7b4b5c6f6e81"],
    budget: 50000,
    goal: "Increase website traffic by 20% within 6 months.",
    client: "TechCorp",
    document: {
      type: "PDF",
      url: "https://example.com/project-document.pdf",
    },
  },
  {
    name: "Mobile App Development",
    description: "Build a mobile app for the company's e-commerce platform.",
    managerId: "64f4f16e1d2b7b4b5c6f6e7e",
    start_date: "2023-08-15T00:00:00Z",
    due_date: "2024-03-01T00:00:00Z",
    status: "pending",
    task_ids: ["64f4f16e1d2b7b4b5c6f6e82", "64f4f16e1d2b7b4b5c6f6e83"],
    budget: 75000,
    goal: "Launch a fully functional mobile app with 10,000 downloads in the first 3 months.",
    client: "E-Shop Inc.",
    document: {
      type: "DOCX",
      url: "https://example.com/app-specifications.docx",
    },
  },
  {
    name: "Cloud Migration",
    description: "Migrate all infrastructure to AWS cloud.",
    managerId: "64f4f16e1d2b7b4b5c6f6e7d",
    start_date: "2023-05-01T00:00:00Z",
    due_date: "2023-10-01T00:00:00Z",
    status: "completed",
    task_ids: [
      "64f4f16e1d2b7b4b5c6f6e84",
      "64f4f16e1d2b7b4b5c6f6e85",
      "64f4f16e1d2b7b4b5c6f6e86",
    ],
    budget: 100000,
    goal: "Successfully migrate all systems to the cloud without downtime.",
    client: "FinBank",
    document: {
      type: "PPTX",
      url: "https://example.com/migration-plan.pptx",
    },
  },
];
