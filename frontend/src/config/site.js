export const site = {
  name: "Study Shelf",
  author: "Dev Kant Kumar",
  authorUrl: "https://devkantkumar.com/",
  companyUrl: "https://unyrisetech.com/",
  url: (
    import.meta.env.VITE_SITE_URL || "https://studyself.devkantkumar.com"
  ).replace(/\/$/, ""),
  contactEmail:
    import.meta.env.VITE_CONTACT_EMAIL || "studyshelf@devkantkumar.com",
  description: "Study notes for Vinoba Bhave University students in Jharkhand. Explore VBU MCA syllabus units, published chapters, examples and revision questions.",
};
