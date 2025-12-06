# Plan for Future Work

- Pages/Routes
  - Catalog: category list `/catalog` and product pages `/catalog/[category]/[slug]` (gallery, specs, compatibility, CTA “Get quote”).
  - Services: dedicated pages `/services/repair-scanners` and `/services/repair-probes` with steps, guarantees, request form.
  - Specials: `/specials` and `/specials/[slug]` with “Get offer” form.
  - News/Articles: `/news` and `/news/[slug]` (cards, pagination, schema.org Article).
  - FAQ: `/faq` with accordion; rewrite for uniqueness.
  - Contacts: `/contacts` with map and feedback form.

- Data/Content
  - Move constants (categories, services, FAQ, specials, contacts) to config/mock JSON or data source.
  - Prepare product structure: `title`, `category`, `tags`, `status (in stock/from warehouse/special price)`, `compatibility`, `specs`, `images`, `cta`.
  - Add schema.org: Organization, Product, FAQ, Article; set up og/meta.
  - Use reference content (texts/images) from [ray-systems.ru](https://ray-systems.ru/) as placeholders, replace later with our own.

- Functionality
  - Request forms: server actions or API routes with honeypot and rate limit; send to mail/CRM (webhook).
  - Phone mask, validation, success/error states.
  - Catalog cards with filters/search (brand/type/availability).

- UI/UX
  - Improve header/footer, mobile menu, sticky CTA.
  - Product galleries, “related products” block.
  - “Trust numbers” block (optional to re-add).
  - Loaders/skeletons for lists and cards.

- Performance/SEO
  - SSG/ISR for catalog, news, specials; sitemap, robots.txt.
  - Next Image with webp/avif, lazy, blur placeholder.
  - Data caching, cache headers, LCP/CLS control.

- Accessibility/Analytics
  - aria for forms, accordions, menu; focus styles.
  - GA4/Yandex Metrica events: form submit, call clicks, catalog/specials CTA.

- Infrastructure
  - Scripts: format/lint/test.
  - E2E for request flow, catalog filter; snapshots of key blocks.
  - Deploy (Vercel/etc.), env for mail/CRM API keys.

- Next tasks (MVP)
  - Add data configs (categories, product mocks, services, FAQ, specials, news).
  - Build pages `/catalog`, `/catalog/[category]/[slug]`, `/services/*`, `/specials`, `/news`.
  - Implement working forms (server action/API) with mail send (mock/console for now).
  - Add sitemap/robots and basic meta/schema.

