# Diksha Shukla — Personal Portfolio Website
**Samsung Innovation Campus Exercise • Version 1.0**

A premium, fast, accessible, and responsive personal portfolio web application built for **Diksha Shukla**, adhering to the approved **Product Requirement Document (PRD)** and **Technical Requirement Document (TRD)**.

---

## 🌟 Executive Overview
This portfolio translates the Samsung Innovation Campus core exercises into a high-impact, recruiter-first digital showcase:
- **Who I Am**: Authentic narrative of developer philosophy, discipline, and core engineering pillars.
- **My Skills**: Structured, interactive categorization of Frontend Markup, JavaScript behaviors, Workflow tools, and soft competencies.
- **Featured Projects**: Verified showcase populated strictly from Diksha's actual public GitHub repositories (`AI-HAR-Detection`, `vigil-voice`, `Main-portfolio`, `3rd-Project`, `new-Project-`).
- **My Future Goal**: Multi-stage strategic engineering roadmap bridging semantic frontend mastery to intelligent, AI-integrated web systems.
- **Connect & Recruiter Hub**: Verified links, direct copy-to-clipboard for email/phone, and a fast-action message composer.

---

## 🚀 Technical Architecture & Stack
- **Markup**: Pure Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Styling**: Modern CSS3 using Custom Properties (tokens), Flexbox & Grid architectures, smooth glassmorphism, and responsive media queries.
- **Behavior**: Lightweight Vanilla JavaScript without external framework dependencies (zero bloat, instant load).
- **Assets**: Optimized WebP image assets (`who-i-am.webp`, `my-skills.webp`, `future-goal.webp`, `diksha-avatar.webp`) and vector SVG icons.
- **Accessibility**: Full keyboard navigability, visible `:focus-visible` styles, WCAG AA contrast compliance, ARIA attributes, and `prefers-reduced-motion` support.

---

## 📁 Directory Structure
```
Samsung Project/
├── index.html                   # Root entry / redirect
├── portfolio/
│   ├── index.html               # Main semantic portfolio markup
│   ├── css/
│   │   └── style.css            # CSS3 design system, themes & animations
│   ├── js/
│   │   └── script.js            # Vanilla JS interactions, theme & clipboard
│   ├── assets/
│   │   ├── images/
│   │   │   ├── who-i-am.webp    # Visual asset for 'Who I Am' module
│   │   │   ├── my-skills.webp   # Visual asset for 'My Skills' module
│   │   │   ├── future-goal.webp # Visual asset for 'My Future Goal' module
│   │   │   └── diksha-avatar.webp # Recruiter-first hero portrait
│   │   └── icons/               # SVG icons for social, contact & tech
│   └── README.md                # Documentation & maintenance guide
```

---

## ⚙️ How to Update Profile, Skills, and Projects

### 1. Updating Profile & Social Links
Open `portfolio/index.html` and search for:
- **Email**: `dikshashukla728@gmail.com`
- **Phone**: `+91 9026748845`
- **GitHub**: `https://github.com/dikshashukla-cyber`
- **LinkedIn**: `https://www.linkedin.com/in/diksha-shukla-4b3b9537a`

### 2. Adding / Modifying Project Cards
Locate `<section id="projects">` in `portfolio/index.html`. Each card is an `<article class="project-card" data-category="...">`. Duplicate or modify the template:
```html
<article class="project-card" data-category="frontend">
  <div class="project-card-top">
    ...
  </div>
  <h3 class="project-title"><a href="...">Project Name</a></h3>
  <p class="project-desc">Description of what was built...</p>
  <div class="project-footer">
    <div class="project-tech-tags">
      <span class="tech-tag">HTML5</span>
    </div>
  </div>
</article>
```

### 3. Adding New Skills
Locate `<section id="skills">` in `portfolio/index.html`. Add items to the `<ul class="skill-list">` within the appropriate category card.

---

## 🌐 Local Preview & Deployment

### Run Locally:
Simply open `portfolio/index.html` in any modern web browser, or launch using VS Code Live Server or Python HTTP server:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000/portfolio/`.

### Deploying to GitHub Pages:
1. Initialize git if not already present:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Diksha Shukla personal portfolio according to TRD/PRD"
   ```
2. Push to your GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/dikshashukla-cyber/<repo-name>.git
   git push -u origin main
   ```
3. In GitHub Repository Settings, enable **GitHub Pages** from the `main` branch.

---

## 🛡️ Verification & Quality Gates (TRD Checklist)
- [x] **TR-01**: One logical `<h1>` and strict hierarchical headings (`<h2>`, `<h3>`).
- [x] **TR-02**: CSS custom properties for tokens (colors, spacing, typography).
- [x] **TR-03**: Responsive Grid/Flexbox with zero rigid absolute positioning for layouts.
- [x] **TR-04**: Max-width containers (`1200px`) for comfortable reading line-lengths.
- [x] **TR-05**: Compressed WebP images with `loading="lazy"` and explicit dimensions.
- [x] **TR-06**: Descriptive alt text for all visual imagery.
- [x] **TR-07**: Visible high-contrast `:focus-visible` styles on all interactive elements.
- [x] **TR-08**: Navigation works completely if JavaScript is disabled.
- [x] **TR-09**: HTTPS verified links for GitHub, LinkedIn, email, and telephone.
- [x] **TR-10**: Zero private credentials or API keys in client-side source.
- [x] **TR-11**: Zero heavy third-party blocking scripts or external framework dependencies.
- [x] **TR-12**: Validated HTML5 and CSS3 with clean browser console output.
