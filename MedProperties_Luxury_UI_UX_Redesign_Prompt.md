# MedProperties — luxury UI and UX redesign prompt

## Purpose of this document

Use this as a complete design and build brief for redesigning the existing MedProperties experience at https://realesate-two.vercel.app/. The product serves doctors and other healthcare professionals in India who need a home near work, a smooth relocation, trustworthy property information, and access to appropriate financing. It also serves landlords who want to list homes and handle qualified inquiries.

The result should feel modern, premium, reassuring, and exceptionally practical for someone whose time is scarce. Think of a discreet property concierge with the clarity of a well-designed clinical tool. Retain the existing MedProperties brand identity and core palette: deep navy, medical teal, white, and pale neutral surfaces. Do not import the orange, olive, pink, or multicolour chart accents from the references. Do not copy their logos, wording, property photos, claims, or exact layouts.

This is a visual and experience redesign, not an invitation to invent inventory, partnerships, testimonials, transaction counts, or financial promises. Use real, verified information where available. When real data is unavailable, show a clearly labelled preview or a graceful empty state.

## What to take from the three visual references

### Reference 1 — cinematic luxury property site (`1.png`)

- Use confident, editorial real-estate photography. The reference gives each property an immersive, wide visual stage with the name, location, essential facts, price, and one clear action placed over the image.
- Preserve its rhythm: large atmospheric hero, focused audience choice, generous property showcases, human stories, a simple process explanation, expert support, useful FAQ, and a strong final contact section.
- Adopt its low-noise copy treatment, fine dividers, restrained labels, and selective serif or italic accent. The supporting typography must remain legible; avoid the reference's very tiny text.
- Make the journey feel personally guided, with visible next steps after each section.
- Translate its luxury into Indian healthcare housing. Use credible imagery of actual homes and neighbourhoods near Indian hospital hubs, not Californian villas or artificial U.S. listing data.

### Reference 2 — architectural editorial landing page (`2.png`)

- Use the deep navy surround and large pale content panels as a way to create contrast and an intentional page rhythm.
- Borrow the bold, oversized sans-serif headline, clean navigation, architectural photography, asymmetrical composition, and generous whitespace.
- Use large rounded panels selectively on the marketing pages. Their generous radius should feel architectural, not like every small control has been inflated.
- Keep the left-side introductory copy concise and specific. The large type should communicate the healthcare benefit immediately; it should never push the first useful action far below the fold.
- Do not imitate the reference's broad, unverifiable social-proof numbers. MedProperties must show evidence for any scale or outcome claim.

### Reference 3 — calm analytics dashboard (`3.png`)

- Use its modular card grid, compact navigation, clearly grouped metrics, large key values, quiet chart backgrounds, and tidy controls for the signed-in landlord and buyer dashboards.
- Translate the accent treatment into MedProperties teal and navy. Reserve any extra semantic colours for genuine status meanings, such as an error or urgent deadline.
- Every metric should answer a user's question and support an action. Examples: live listings, new inquiries, upcoming tours, saved homes, average response time, and listing completeness.
- Avoid decorative charts, fake trend lines, auto-generated insights, and sample figures presented as live data. Empty states should explain the next useful action.
- Preserve the reference's sense of breathing room and scanability while using accessible label sizes and readable chart legends.

## Master prompt for design and implementation

Redesign MedProperties as a premium Indian real-estate and relocation platform for healthcare professionals. The design should combine cinematic property imagery, bold architectural layout, and calm dashboard usability. Keep the current navy and teal identity while elevating it with precise typography, generous spacing, quiet motion, and credible content. The experience must work end to end on desktop and mobile.

The brand promise is: **a more considered way to find a home close to care**. Speak to doctors' real circumstances: on-call travel, rotating shifts, family moves, training transitions, professional documentation, and limited time for viewings. Respect the user; do not fill the interface with medical clichés such as crosses, stethoscopes, ECG lines, or generic stock images of smiling doctors. Use healthcare context in the information and service, not as decoration.

### Emotional direction

The first impression should be assured and warm, like a trusted specialist who has already done the homework. The interface should feel quiet, fast, and private. Luxury should come from real photography, strong composition, refined materials, and thoughtful service rather than gold effects, glassmorphism, heavy gradients, or oversized claims. The user should always understand where they are, what is verified, what happens next, and how long an action is likely to take.

### Brand and visual system

- **Primary colours:** retain the current deep navy (`#0A2540`) and MedProperties teal (`#008374`) as the brand anchors. Use white and the site's pale cool neutrals for content surfaces. Dark navy is suitable for the outer shell, key headings, footer, and selected panels; teal is for primary actions, selected states, verified marks, and key interactive accents.
- **Tonal hierarchy:** use navy on pale backgrounds for the highest reading contrast. Use teal for emphasis sparingly. Create lighter navy and teal tints only from the existing palette. Avoid adopting the orange chart colour in reference 3 or the olive theme in reference 1.
- **Typography:** choose a polished, highly readable modern sans-serif for the interface and large editorial headings. One restrained serif or italic style may accent a short phrase in campaign sections, echoing reference 1. Keep forms, prices, metrics, instructions, and long paragraphs in the sans-serif. Use real font weights and optical sizes, with no overly thin body text.
- **Scale:** desktop hero heading approximately 64–88 px depending on width; mobile approximately 40–52 px. Body copy 16–18 px; supporting text at least 14 px. Use a maximum content width around 1280–1440 px, a 12-column desktop grid, and a consistent spacing scale based on 8 px increments.
- **Surface language:** broad pale panels against navy in marketing sections; clean white cards on a soft neutral background in tools and dashboards. Use large radii around 24–32 px for major editorial panels and more restrained 12–18 px radii for controls. Shadows should be subtle; borders and spacing should do most of the grouping.
- **Imagery:** prioritise real Indian residences, streets, interiors, hospitals' surrounding neighbourhoods, and useful details such as workspaces and blackout curtains. Show time of day and context naturally. A property's first image should be truthful to that property. Use carefully graded photography without making spaces misleadingly dark or dramatic.
- **Icons:** simple, consistent line icons. Pair important icons with text. Avoid icon-only navigation unless the accessible name and tooltip are clear.
- **Motion:** brief, composed transitions (roughly 160–240 ms) for hover, focus, tab change, card reveal, and modal entry. No parallax that interferes with scrolling. Honour reduced-motion preferences.

### Global navigation and information architecture

Create clear, shareable routes rather than one long root-page state. The primary navigation should be **Explore homes**, **Buy**, **For landlords**, **How it works**, **Resources**, and a distinct **Talk to a specialist** action. Account access belongs at the far edge of the header. If practice spaces are a real offering, give them a clear route; otherwise do not promise them in the hero.

Provide dedicated pages for home, searchable results, each property, buyer financing, landlord services, useful guides/FAQ, contact, sign-in, and the relevant signed-in dashboards. The Rent and Buy journeys should have distinct inventory, pricing, filters, and detail language. Keep legal and privacy information available as real links. Keep admin, database, and infrastructure controls out of the public interface.

Navigation should be visible and predictable on desktop. On mobile, use a compact header with a plainly labelled menu, a prominent search or explore action, and a drawer that is easy to close. Deep links should preserve filters and return users to the same result state after viewing a property.

## Page and component briefs

### 1. Homepage

**Hero:** make one clear statement about housing for healthcare professionals, such as “A home closer to the work that matters.” Support it with one short sentence about verified homes near major hospitals and a personal relocation service. Use a full-width or carefully framed real property photograph with dark navy overlay where text needs contrast. The first viewport should include a clear primary action and an immediately usable search entry, without hiding either below large decorative space.

**Search console:** a refined, compact panel with an obvious Rent/Buy selection. Let users search by hospital or locality first, then choose city, commute time, budget, BHK, and move-in date. Support typeahead with recognisable hospital names and area context. Let users clear or edit each selection. The search action must open a results page showing the chosen criteria, a real result count, and a useful empty state if nothing matches.

**Curated homes:** combine the cinematic horizontal property showcases from reference 1 with concise, accessible detail cards. Feature a small number of real, high-quality homes rather than a large set of placeholders. Show city/locality, rent or sale price, BHK, key amenities, availability, verified date, and commute to a named hospital. One primary action should open the property detail page.

**Why MedProperties:** three or four short benefits tied to real service behaviour, such as verified property information, hospital commute clarity, flexible viewing support, and financing guidance. Explain exactly what “verified” means.

**How it works:** a clear sequence from search to shortlist to viewing to documentation and move-in. Borrow the guided journey feel of reference 1, but make it simple to scan and usable without a carousel.

**For landlords:** a distinct section explaining who can list, how verification works, how inquiries arrive, and how to start. Avoid unqualified guarantees of rent, vacancy, placement, or tenant quality.

**Proof and people:** show real testimonials, names, roles, and permissions only when verified. If evidence is not available, use a service-process explanation in this slot instead. Explain the team and contact method without fabricating credentials or hospital partnerships.

**FAQ and final CTA:** answer practical questions about hospital proximity, eligibility, visits, fees, documentation, and financing. End with a reassuring contact or concierge request block that specifies what happens after submission and when the user can expect a response.

### 2. Search and results

Make this the strongest functional part of the product. The top should show the current search in human language: for example, “2 BHK rentals within 20 minutes of Manipal Hospital, Bengaluru.” Keep filters visible as editable chips and provide a clear reset action. Add sorting by relevance, commute, newest, and price. On desktop, use a filter column and a spacious results grid; on mobile, use a full-screen filter sheet with Apply and Reset actions.

Each result should show a genuine image, locality, monthly rent or sale price, area with a single consistent unit, bedrooms and bathrooms, verified status with the date, availability, and a meaningful hospital commute estimate with travel mode. Distinguish straight-line distance from estimated travel time. Mark sponsored placements clearly if any exist. Saved-state controls must work, reflect state visibly and to assistive technology, and persist for the account.

Provide map view only if it shows accurate positions and useful hospital context. Results should have loading skeletons, empty states with helpful alternatives, and clear error recovery.

### 3. Property detail

Give each property a unique URL and a photographic gallery with genuine captions. Lead with the facts that matter: price and period, exact or appropriately protected locality, availability, property type, area, furnishing, deposit, maintenance, parking, and lease terms. Present verified facts and unverified seller statements differently. Show the verification method and date.

Create a dedicated “For your workday” panel for relevant amenities: commute to selected hospitals, travel mode and time of day, quiet workspace, blackout treatment, lift, power backup, parking, and flexible viewing options. Only show facts that can be substantiated. Make the tour action persistent but unobtrusive. If there is a real video or 360-degree walkthrough, label it “Virtual tour”; otherwise label the action “See photos” or “Request a video tour.”

The inquiry form should ask only what is needed to schedule or respond. State what data is shared, with whom, and what happens after sending. Confirm successful submission and provide a next-step timeline. Do not prefill forms with a fabricated doctor's personal information.

### 4. Buyer financing and EMI tool

Present the calculator as a useful planning aid with a clean, spacious panel inspired by reference 3. Include property value, down payment, interest rate, tenure, monthly payment, total interest, and total repayment. Changing any input must update every dependent value. Give sliders explicit labels and numeric inputs, with Indian currency formatting throughout. Clearly identify the rate as an editable assumption and explain that actual lender terms vary.

Any named bank partnership, preferential rate, fee waiver, approval time, or eligibility promise must be current and evidenced. Place a concise explanation of the financing process beside the tool. The next action should be a transparent consultation request, not an unexplained “apply” button.

### 5. Landlord onboarding and dashboard

Use reference 3 as the main inspiration for the signed-in experience: a restrained navigation rail or compact top navigation, white data cards on pale neutral, careful hierarchy, and clear status tags. The first screen should answer: What needs my attention today? Show live listings, new inquiries, upcoming tours, and outstanding tasks only when actual records exist. Each metric should open the relevant underlying list.

The listing flow should be a guided form with progress: property basics, location, pricing and terms, amenities, media, verification, preview, publish. Explain required fields and save drafts. Photo upload needs progress, reorder, cover selection, limits, and failure recovery. Validate inputs before publishing and show exactly what the public listing will reveal.

Inquiries should show status, property, requested action, preferred dates, and a safe reply path. Saved homes should be separate from owned listings. The dashboard should never show a “100% guarantee” or sample medical-professional contact details as live data. An empty state should invite the owner to create a listing, with a short description of what is required.

### 6. Account and trust surfaces

Use a real authentication flow with clear sign-in, sign-out, session state, and recovery. A demo mode, if retained, must be unmistakably labelled and isolated from production data. Remove public database settings entirely. Publish real Privacy Policy and Terms pages, contact information, and a plain-language explanation of property verification. Allow users to understand and manage saved homes and their submitted inquiries.

## Interaction and experience rules

1. Every visible button must have a meaningful outcome. A navigation item opens a destination, a tab changes content and selected state, a save control updates state, and a carousel arrow moves to another item. Remove controls that cannot yet work.
2. Show immediate feedback for search, saving, form submission, upload, verification, and errors. Never leave users wondering whether an action registered.
3. Preserve context across journeys: returning from a property restores filters, sort order, and scroll position; a logged-in user returns to the intended action after signing in.
4. Make concierge service explicit. At relevant moments offer “Ask about this home,” “Arrange a viewing,” or “Get relocation help,” with clear expectations and no aggressive pop-ups.
5. Keep labels honest. “Verified,” “near hospital,” “virtual tour,” “partner lender,” and “available” must each have a documented meaning and current source.
6. Avoid generic fake inventory, U.S. addresses with rupee prices, filler testimonials, vague performance percentages, and misleading placeholder data.
7. Use calm forms: visible labels, examples, validation near the field, progress where the form is long, and no unnecessary personal details.
8. For desktop and mobile, make keyboard focus, hover, selected, loading, disabled, success, and error states visually distinct and consistent.

## Responsive behaviour

- **Desktop:** use the reference 2 editorial composition for the homepage and a modular, high-density but calm grid for dashboards. Keep core search in the first viewport. Do not leave large uninformative blank regions.
- **Tablet:** reduce asymmetry and maintain a two-column layout where content remains legible. Make filters collapsible and keep the main action visible.
- **Mobile:** stack content in a deliberate story, not simply the desktop order squeezed into one column. Place the value proposition, search, and first real inventory early. Use full-width tap targets of at least 44 px height, readable text, and a fixed bottom action only when it helps a property-detail or form flow. Cards should show enough facts without opening them.
- **Images:** use responsive sources and stable aspect ratios to avoid layout shift. Preserve focal points when cropping. Provide meaningful alt text for informative images.

## Accessibility and quality bar

- Target WCAG 2.2 AA for colour contrast, focus visibility, form labels, keyboard access, and touch targets.
- Use semantic links for navigation and semantic buttons for actions. Give every icon button an accessible name. Expose tab and save states using the correct attributes.
- Make dialogs labelled, focus contained, closable by Escape, and return focus to their trigger. Avoid modal use for full property pages.
- Make charts understandable without colour alone; offer text summaries or tables for important metrics.
- Respect reduced motion. Avoid autoplay media and motion that delays task completion.
- Give pages unique titles, descriptions, canonical URLs, Open Graph images, and structured data when facts support it.
- Load the hero image quickly, lazy-load later images, and keep the interface responsive on average mobile networks.

## Suggested copy direction

Write in clear, confident Indian English. Prefer specific services over sweeping superlatives. Examples of the desired tone:

- Hero: “A home closer to the work that matters.”
- Support: “Explore verified homes near the hospitals that shape your day. We help with the search, viewings, and move.”
- Search action: “Explore homes.”
- Property status: “Verified on 12 September 2026” (only when true).
- Commute: “Approx. 18 min by car to Manipal Hospital at 8 a.m.” (only when calculated from real data).
- Concierge CTA: “Talk through your move.”

Avoid “best deal,” “dream home,” “100% placement,” and “zero stress” unless a specific, substantiated product promise explains them.

## Required deliverables

Produce a coherent design system and responsive designs for:

1. Homepage at desktop, tablet, and mobile sizes.
2. Rent and Buy search results, including active filters, empty state, loading state, and error state.
3. Property detail with gallery, verification, healthcare-fit information, and tour request.
4. Financing page and interactive EMI calculator.
5. Landlord landing, listing wizard, and signed-in dashboard.
6. Saved homes, inquiries, account menu, FAQ, contact, privacy, and terms surfaces.
7. Component states for header, menus, search, tabs, cards, chips, buttons, forms, modals, notifications, and charts.

For each design, annotate the primary user goal, the most important action, interaction states, data required, and mobile adaptation. Include a content and data checklist identifying which claims require verification before launch.

## Acceptance criteria

The redesign succeeds when a doctor can search for an Indian home by hospital and move-in needs, compare trustworthy listings, understand commute and lease details, save a home, and request a viewing with clear confirmation. A landlord can create and preview a listing, manage genuine inquiries, and understand what needs attention. All prominent navigation and calls to action work. The brand remains recognisably navy and teal, while the visual experience feels as considered as the references. No public UI exposes administrative infrastructure. No prototype data is presented as live fact.
