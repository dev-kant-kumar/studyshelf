# Developer role roadmaps

The Developer Shelf offers the existing Node.js backend roadmap plus frontend, Python backend, and Java backend paths. New curricula live in `frontend/src/app/main-website/pages/Developers/roleRoadmapData.js` and share `RoleRoadmap.jsx`. Each path contains eight sequential stages and 32 topics, prerequisites, an evolving project, a build milestone and readiness check per stage, and official learning references.

Routes are `/developers/frontend-roadmap`, `/developers/python-backend-roadmap`, and `/developers/java-backend-roadmap`. The public page registry derives their entries from the curriculum, so the static build and sitemap include them. Developer social metadata applies automatically. Unknown roadmap slugs render the existing error page.

Progress is stored separately under `studyshelf-<slug>-progress-v1`. Topic IDs must remain stable; invalid, obsolete, or duplicate saved values are filtered. Browser storage failures retain in-memory progress and show a useful message. Checkboxes represent self-assessment, not proof of employment readiness. Search and unfinished-only filters do not change saved progress. Selecting a stage clears filters so the anchor remains reachable.

Learning scope:

- Frontend: HTML, accessible forms, responsive CSS, JavaScript, strict TypeScript, React, API integration, testing and deployment.
- Python backend: environment management, Python, SQL, Django, Django REST framework, permissions, tests and deployment.
- Java backend: JDK/build tools, Java, SQL/JDBC, Spring Boot, JPA, Spring Security, tests and operations.

Official starting references checked on 2026-10-19: https://developer.mozilla.org/en-US/curriculum/, https://docs.djangoproject.com/en/5.2/intro/overview/, and https://spring.io/guides/gs/rest-service/. Learners should use supported releases and documentation matching their installed versions. Advanced alternatives are follow-up study rather than compulsory prerequisites.
