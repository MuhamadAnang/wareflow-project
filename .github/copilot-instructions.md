# Copilot Instructions

Panduan lengkap untuk menggunakan AI Copilot dengan skill-skill yang tersedia di proyek ini. Dokumen ini menjelaskan kapan dan bagaimana menggunakan setiap skill untuk mendapatkan hasil optimal.

## Daftar Skill Tersedia

### 1. **API Security Best Practices**

- **Deskripsi**: Implementasikan pola desain API yang aman termasuk autentikasi, otorisasi, validasi input, rate limiting, dan perlindungan terhadap kerentanan API umum.
- **Gunakan ketika**:
  - Merancang endpoint API baru
  - Mengamankan API yang ada
  - Mengimplementasikan autentikasi dan otorisasi
  - Melindungi dari serangan API (injection, DDoS, dll)
  - Melakukan review keamanan API
  - Mempersiapkan untuk audit keamanan
  - Mengimplementasikan rate limiting dan throttling
  - Menangani data sensitif dalam API

---

### 2. **Clean Code**

- **Deskripsi**: Menerapkan prinsip-prinsip dari "Clean Code" oleh Robert C. Martin. Fokus pada nama yang bermakna, fungsi yang kecil, komentar yang tepat, penanganan error, dan desain class yang baik.
- **Gunakan ketika**:
  - Menulis kode baru untuk memastikan kualitas dari awal
  - Melakukan review Pull Request
  - Melakukan refaktoring kode legacy
  - Meningkatkan standar tim
- **Jangkauan**: Naming, Functions, Comments, Error Handling, Class Design

---

### 3. **KISS, DRY, YAGNI**

- **Deskripsi**: Prinsip-prinsip desain kode yang sederhana dan efisien. KISS (Keep It Simple, Stupid) untuk kesederhanaan, DRY (Don't Repeat Yourself) untuk menghindari duplikasi, YAGNI (You Aren't Gonna Need It) untuk menghindari over-engineering.
- **Gunakan ketika**:
  - Review code quality dan refactoring
  - Menyederhanakan code yang kompleks
  - Mendeteksi duplikasi kode
  - Menghindari premature optimization
  - Mengajarkan best practices tentang simplicity
- **Fokus**: Simplicity, DRY principle, Complexity reduction, Early returns, Code composition

---

### 4. **Code Review Excellence**

- **Deskripsi**: Master praktik code review yang efektif untuk memberikan feedback yang konstruktif, menangkap bug lebih awal, dan mendorong berbagi pengetahuan sambil menjaga moral tim.
- **Gunakan ketika**:
  - Melakukan review Pull Request
  - Menetapkan standar review untuk tim
  - Mentoring junior developer melalui review
  - Melakukan review arsitektur
  - Membuat checklist dan panduan review

---

### 5. **Code Review Expert**

- **Deskripsi**: Review kode ahli dari perubahan git terkini dengan perspektif senior engineer. Mendeteksi SOLID violations, risiko keamanan, dan mengusulkan perbaikan yang dapat dilakukan.
- **Gunakan ketika**:
  - Melakukan review mendalam terhadap perubahan git
  - Mencari SOLID violations
  - Mengidentifikasi removal candidates
  - Mendeteksi risiko keamanan
- **Severity Levels**: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)

---

### 6. **Copywriting**

- **Deskripsi**: Expertise dalam menulis, menulis ulang, atau meningkatkan copy marketing untuk halaman apa pun termasuk homepage, landing pages, pricing pages, feature pages, about pages, atau product pages.
- **Gunakan ketika**:
  - Menulis copy marketing
  - "write copy for...", "improve this copy", "rewrite this page"
  - Membuat headline atau CTA copy
- **Catatan**: Untuk email copy, lihat email-sequence skill. Untuk popup copy, lihat popup-cro skill.

---

### 7. **Database Schema Designer**

- **Deskripsi**: Desain schema database yang robust dan scalable untuk SQL dan NoSQL. Menyediakan panduan normalisasi, strategi indexing, pola migrasi, desain constraint, dan optimasi performa. Memastikan integritas data, performa query, dan model data yang maintainable.
- **Gunakan ketika**:
  - Merancang schema database baru
  - Mengoptimalkan schema yang ada
  - Membuat strategi indexing
  - Merencanakan migrasi database
  - Mengoptimalkan performa query

---

### 8. **Docs Writer**

- **Deskripsi**: Expertise dalam menulis, meninjau, atau mengedit file dokumentasi dan file `.md` di repository. Memastikan dokumentasi akurat, jelas, dan konsisten sesuai dengan standar proyek.
- **Gunakan ketika**:
  - Menulis atau meninjau dokumentasi
  - Mengedit file `.md` atau file di direktori `/docs`
  - Memastikan konsistensi gaya penulisan dokumentasi
  - Mengikuti standar kontribusi proyek

---

### 9. **Frontend Code Review**

- **Deskripsi**: Review kode frontend untuk file `.tsx`, `.ts`, `.js`. Mendukung review perubahan yang pending dan review file yang fokus sambil menerapkan checklist rules.
- **Gunakan ketika**:
  - Melakukan review file frontend (`.tsx`, `.ts`, `.js`)
  - Review perubahan yang pending untuk commit
  - Review file spesifik dengan checklist comprehensive
- **Fokus**: Code Quality, Performance, Business Logic

---

### 10. **Logging Best Practices**

- **Deskripsi**: Panduan logging yang fokus pada wide events (canonical log lines) untuk debugging dan analytics yang powerful.
- **Gunakan ketika**:
  - Menulis atau meninjau kode logging
  - Menambahkan console.log, logger.info, atau sejenisnya
  - Merancang strategi logging untuk service baru
  - Menyiapkan infrastruktur logging
- **Fokus**: Wide Events (satu context-rich event per request per service)

---

### 11. **Memory Safety Patterns**

- **Deskripsi**: Cross-language patterns untuk memory-safe programming termasuk RAII, ownership, smart pointers, dan resource management di Rust, C++, dan C.
- **Gunakan ketika**:
  - Menulis memory-safe systems code
  - Mengelola resources (files, sockets, memory)
  - Mencegah use-after-free dan memory leaks
  - Mengimplementasikan RAII patterns
  - Debugging memory issues

---

### 12. **Next Best Practices**

- **Deskripsi**: Best practices Next.js mencakup file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling.
- **Gunakan ketika**:
  - Menulis atau review kode Next.js
  - Mendeteksi invalid React Server Component patterns
  - Mengimplementasikan async patterns
  - Memilih runtime yang tepat
  - Menggunakan directives (`use client`, `use server`, `use cache`)

---

### 13. **Next.js**

- **Deskripsi**: Build Next.js 16 apps dengan App Router, Server Components/Actions, Cache Components ("use cache"), dan async route params. Includes proxy.ts dan React 19.2. Mencegah 25 documented errors.
- **Gunakan ketika**:
  - Membangun Next.js 16 projects
  - Troubleshooting async params (Promise types)
  - "use cache" directives
  - Parallel route 404s
  - Turbopack issues, i18n caching, navigation throttling
- **Versi**: Next.js 16.1.1, React 19.2.3, Node.js 20.9+

---

### 14. **Next.js Best Practices**

- **Deskripsi**: Prinsip Next.js App Router. Server Components, data fetching, routing patterns.
- **Gunakan ketika**:
  - Memutuskan antara Server vs Client Components
  - Mengimplementasikan data fetching patterns
  - Membuat routing strategy
  - Mengoptimalkan performa Next.js
- **Fokus**: Server vs Client Components, Data Fetching, Routing Patterns

---

### 15. **Performance**

- **Deskripsi**: Optimasi web performance untuk faster loading dan better user experience. Fokus pada loading speed, runtime efficiency, dan resource optimization berdasarkan Lighthouse audits.
- **Gunakan ketika**:
  - "speed up my site", "optimize performance"
  - "reduce load time", "fix slow loading"
  - "improve page speed", "performance audit"
  - Mengidentifikasi bottleneck performa
  - Mengoptimalkan Core Web Vitals
- **Fokus**: Critical rendering path, Resource loading, Runtime performance

---

### 16. **React useEffect**

- **Deskripsi**: React useEffect best practices dari official docs. Mengajarkan kapan TIDAK menggunakan Effect dan alternatif yang lebih baik.
- **Gunakan ketika**:
  - Menulis atau review useEffect
  - Menggunakan useState untuk derived values
  - Data fetching
  - State synchronization
  - Memutuskan apakah perlu Effect atau tidak
- **Prinsip**: Effects adalah escape hatch dari React, gunakan untuk sync dengan external systems

---

### 17. **Responsive Design**

- **Deskripsi**: Implementasikan modern responsive layouts menggunakan container queries, fluid typography, CSS Grid, dan mobile-first breakpoint strategies.
- **Gunakan ketika**:
  - Membangun adaptive interfaces
  - Mengimplementasikan fluid layouts
  - Membuat component-level responsive behavior
  - Merancang untuk multiple screen sizes
  - Mengoptimalkan untuk mobile-first
- **Teknologi**: Container Queries, CSS Grid, Flexbox, Fluid Typography

---

### 18. **Security Review**

- **Deskripsi**: Comprehensive security checklist dan patterns. Memastikan semua kode mengikuti security best practices dan mengidentifikasi kerentanan potensial.
- **Gunakan ketika**:
  - Menambahkan autentikasi atau otorisasi
  - Menangani user input atau file uploads
  - Membuat endpoint API baru
  - Bekerja dengan secrets atau credentials
  - Mengimplementasikan payment features
  - Menyimpan atau mengirim data sensitif
  - Mengintegrasikan third-party APIs
- **Checklist**: Secrets Management, Input Validation, Authentication, Authorization, HTTPS, Rate Limiting

---

### 19. **SQL Optimization Patterns**

- **Deskripsi**: Master SQL query optimization, indexing strategies, dan EXPLAIN analysis untuk dramatically improve database performance dan eliminate slow queries.
- **Gunakan ketika**:
  - Debugging slow-running queries
  - Mendesain database schemas yang performant
  - Mengoptimalkan response time aplikasi
  - Mengurangi database load dan costs
  - Meningkatkan scalability
  - Menganalisis query plans
  - Mengimplementasikan efficient indexes
  - Menyelesaikan N+1 query problems
- **Tools**: EXPLAIN, EXPLAIN ANALYZE, Query Optimization

---

### 20. **TanStack Query**

- **Deskripsi**: Manage server state dalam React dengan TanStack Query v5. Covers useMutationState, simplified optimistic updates, throwOnError, network mode (offline/PWA), dan infiniteQueryOptions.
- **Gunakan ketika**:
  - Setup data fetching
  - Fix v4→v5 migration errors (object syntax, gcTime, isPending, keepPreviousData)
  - Debug SSR/hydration issues dengan streaming server components
  - Implementasi optimistic updates
  - Manage mutation state across components
- **Versi**: @tanstack/react-query@5.90.19+, React 18.0+

---

### 21. **TypeScript Advanced Types**

- **Deskripsi**: Master TypeScript's advanced type system termasuk generics, conditional types, mapped types, template literals, dan utility types untuk building type-safe applications.
- **Gunakan ketika**:
  - Membangun type-safe libraries atau frameworks
  - Creating reusable generic components
  - Implementing complex type inference logic
  - Designing type-safe API clients
  - Building form validation systems
  - Creating strongly-typed configuration objects
  - Implementing type-safe state management
  - Migrating JavaScript codebases to TypeScript
- **Topik**: Generics, Conditional Types, Mapped Types, Template Literal Types, Utility Types

---

### 22. **TypeScript Expert**

- **Deskripsi**: TypeScript dan JavaScript expert dengan deep knowledge tentang type-level programming, performance optimization, monorepo management, migration strategies, dan modern tooling.
- **Gunakan ketika**:
  - Ada TypeScript/JavaScript issues yang kompleks
  - Type-level programming yang sophisticated
  - Build performance optimization
  - Debugging dan architectural decisions
- **Catatan**: Untuk specific cases, akan merekomendasikan subagent yang lebih spesifik

---

### 23. **UI/UX Pro Max**

- **Deskripsi**: Design intelligence untuk web dan mobile apps. Berisi 50+ styles, 97 color palettes, 57 font pairings, 99 UX guidelines, dan 25 chart types di 9 technology stacks.
- **Gunakan ketika**:
  - Merancang UI components atau pages
  - Memilih color palettes dan typography
  - Review kode untuk UX issues
  - Membangun landing pages atau dashboards
  - Implementing accessibility requirements
- **Stacks**: React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui
- **Fokus**: Accessibility, Touch & Interaction, Performance, Layout, Typography, Animation, Styles

---

### 24. **Vercel React Best Practices**

- **Deskripsi**: React dan Next.js performance optimization guidelines dari Vercel Engineering. Berisi 57 rules di 8 categories, prioritized by impact.
- **Gunakan ketika**:
  - Menulis React components atau Next.js pages
  - Mengimplementasikan data fetching
  - Review untuk performance issues
  - Refactoring React/Next.js code
  - Mengoptimalkan bundle size atau load times
- **Fokus**: Eliminating Waterfalls, Bundle Size, Server-Side Performance, Client-Side Data Fetching, Re-render Optimization

---

## Cara Menggunakan Skill

### Perturkar Explicit dengan Skill

Kapan pun task Anda sesuai dengan scope skill (lihat "Gunakan ketika"), sebut skill tersebut:

```
Gunakan skill "Clean Code":
Review fungsi berikut untuk memastikan mengikuti clean code principles...
```

### Kombinasi Multiple Skills

Beberapa task memerlukan multiple skills. Contoh:

- **API Security + Code Review Expert** untuk review endpoint API baru
- **Next.js + Performance** untuk mengoptimalkan Next.js app
- **TypeScript Advanced Types + TypeScript Expert** untuk complex type systems

### Prioritas Selection

1. **Specific domain skills** (Next.js, React, Security, etc) - gunakan duluan
2. **Cross-cutting skills** (Clean Code, Code Review, Performance) - gunakan setelahnya
3. **Specialist experts** (TypeScript Expert, UI/UX Pro Max) - gunakan untuk deep dives

---

## Quick Reference by Task Type

### Debugging & Troubleshooting

- **TypeScript Issues**: `typescript-expert`, `typescript-advanced-types`
- **Performance Issues**: `performance`, `sql-optimization-patterns`
- **Component Issues**: `react-useeffect`, `ui-ux-pro-max`
- **Next.js Issues**: `nextjs`, `nextjs-best-practices`

### Code Review & Quality

- `code-review-excellence` - General code review approach
- `code-review-expert` - Deep technical review
- `frontend-code-review` - Frontend-specific review
- `clean-code` - Code quality standard
- `kiss-dry-yagni` - Simplicity and refactoring principles

### Feature Implementation

- **API Endpoints**: `api-security-best-practices`, `security-review`
- **Database**: `database-schema-designer`, `sql-optimization-patterns`
- **UI Components**: `ui-ux-pro-max`, `responsive-design`
- **React Logic**: `react-useeffect`, `tanstack-query`

### Optimization

- `performance` - Overall performance
- `vercel-react-best-practices` - React-specific optimization
- `sql-optimization-patterns` - Database optimization
- `bundle-optimization` - Bundle size

### Documentation & Writing

- `docs-writer` - Technical documentation
- `copywriting` - Marketing copy

---

## Best Practices for Using Skills

1. **Be Specific**: Sebutkan skill secara eksplisit dan konteks task
2. **Provide Context**: Berikan code snippets, error messages, atau requirements
3. **Ask for Implementation**: Skills siap untuk implementasi, bukan hanya saran
4. **Follow Recommendations**: Skills mengandung best practices terbaru dan proven patterns
5. **Use Multiple Skills**: Jangan ragu untuk kombinasi skills yang relevan

---

## Version & Updates

- **Last Updated**: February 14, 2026
- **Total Skills**: 24
- **Primary Framework**: Next.js 16, React 19.2
- **Database Focus**: SQL (PostgreSQL), NoSQL patterns
- **Language**: TypeScript-first, JavaScript support

---

## Contact & Support

Untuk pertanyaan tentang skill atau request tambahan skill, hubungi team lead atau document tech lead.
