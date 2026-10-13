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
  description: "BCA and MCA study notes, organised for easier learning.",
};
