# Freedom Formula — Teardown & Translation Notes for Pixel Kriti

Source: https://www.gofreedomformula.co/ — captured with Playwright on 2026-07-14.
9 pages scraped (home, about, DWY, DFY, case-study index, a case-study detail, testimonials,
who-we-serve, contact). Screenshots, full copy, and computed design tokens are in the
session scratchpad under `ff/`.

The point of this document is **not** "copy this site." It is: understand exactly what makes it
land, separate the parts that are genuinely good from the parts that are cheap, and map the good
parts onto Pixel Kriti's very different brand and very different honesty constraints.

---

## 1. What the site actually is

A high-ticket B2B **coaching/agency offer** out of India (₹ pricing, +91 numbers), selling
client-acquisition systems to agencies, coaches, startups, consultants, and freelancers.

Two productized tiers, and this is the single smartest thing on the site:

| | DWY (Done-With-You) | DFY (Done-For-You) |
|---|---|---|
| Who | Profitable ₹0–3 L/month | Profitable ₹1 Cr+/month |
| Stage | Early-to-mid | Mid-to-large |
| Promise | We install the infrastructure *with* you | We run everything; you only strategize |

Every visitor self-sorts within one screen. There is no "contact us for a quote" fog. Note they
still refuse to publish a price — the tier is the qualifier, the call is the close.

Under both tiers sits one fixed four-module spine, repeated everywhere:
**Outbound Infrastructure → Inbound Infrastructure → Sales Mastery → Discipline.**
Same four, same order, every page. That repetition is what makes a coaching offer feel like a
*system* rather than a vibe. **This is the structural lesson for us.**

---

## 2. Information architecture — the home page in order

Fifteen viewport-heights (14,141px). The order is the argument:

1. **Hero** — black. `CLIENT ACQUISITION SOLVED FOREVER` at 150px Oswald, plus one clarifying
   sentence and a "Scroll for more" cue. No form, no fluff.
2. **Stat bar** — 97% / 1,750 / 0.6% / $1.5M. Proof *immediately* after the claim, before any
   explanation. (More on the honesty problem below.)
3. **Founder video / b-roll** — a face, early.
4. **Our Strategy** — "Two Growth Paths, One Proven System." → the DWY/DFY fork.
5. **How We Do It** — the four modules, as a vertical timeline with a dotted spine, orange
   section titles, and a bespoke line-art diagram per module (funnel, orbit, network).
6. **Who Do We Serve** — four audience claims over a photo mosaic of real events/office
   (`WE TURN STARTUPS INTO MARKET LEADERS`, with the second half in orange).
7. **Founder quote** — Aditya Choudhary, named, with title.
8. **Client Testimonials** — a *carousel of vertical selfie videos*, first-name captioned, plus an
   infinite marquee of 14 names.
9. **Case studies** — "Dive Deep into some of the Results" → VIEW CASE STUDIES.
10. **FAQ** — 9 questions, all objection-shaped (see §3).
11. **Contact** — full-bleed orange, form on white card, phone numbers, Google 4.5★/569 reviews.
12. **Footer** — giant outlined `LET'S CONNECT`, then repeats the hero line as a sign-off:
    `CLIENT ACQUISITION, SOLVED FOREVER`.

**The shape to steal:** *Claim → proof → self-sort → method → who it's for → faces → results →
objections → contact.* Then close by repeating the opening promise. Pixel Kriti's home page
currently reads as a sequence of sections; this reads as a single argument that closes a loop.

---

## 3. The copy system

This is the strongest part of the site, and the part we can learn from most safely.

**Headlines are outcomes, not descriptions.** "Client Acquisition Solved Forever." "Two Growth
Paths, One Proven System." "Because at your level, execution speed decides the winner."
Not one headline describes a feature.

**Two-register stack.** Every section is a condensed-uppercase *label* (OUTBOUND INFRASTRUCTURE)
over a human sentence in Lato ("Achieve success with our full-stack, growth-driven solutions").
The eyebrow shouts, the subhead explains. We already have this pattern in `SectionHeading` —
we just don't push the contrast far enough.

**They write the reader's pain in the reader's own words.** From the DWY page:

> "You (a founder) are stuck at chasing leads, working 8–12 hours a day even after successfully
> establishing the proof of concept, fighting price objections, blowing up every negotiation, and
> watching your competition (who's not even that good btw) run past you."

That parenthetical — *"who's not even that good btw"* — is the whole trick. It's the sentence a
real founder would say at 1am, not the sentence a marketer would write. It is deliberately
un-polished, and that is exactly why it doesn't read as AI.

**FAQs are objections, not information.** Look at the list: *"I hate selling. Will this still work
for me?" / "Do I need case studies to start?" / "Will this work if I don't have a big audience?" /
"How much do I need to spend on paid ads?"* Every single one is a reason someone would say no. Our
current FAQ is half education ("What is a CRM, actually?"), which is fine for a first-time buyer,
but we have zero questions that name the reader's fear of *not being ready*.

**They name the enemy.** "We don't sell dopamine hits or short-term tactics." "Not theory. Not
motivational BS." "Strategies not focused on instant gratification or shiny objects."
We already have this instinct and it's our best line: *"We build, we do not resell"* and
*"Most AI agencies resell platforms and earn while you stay subscribed. We are paid to finish."*
We should be **much** louder about it. It's currently buried in FAQ #5.

**One repeated proof-line, used three times verbatim** ("Join 500+ business owners who testify…").
Repetition of a single line across the page acts as a drumbeat. Cheap, effective.

---

## 4. The visual system (measured, not guessed)

WordPress + Elementor under the hood. Tokens actually in use:

```
--black   #000000
--white   #ffffff
--dark    #171717   (body text)
--primary #ff9740   (the ONE accent — orange)
```

- **Type:** Oswald (condensed, 600/700, uppercase) for display; Lato for everything else.
  Just two families. Body copy is Lato 17px/24px.
- **Display scale is enormous and confident:** H1 at **150px with −7.5px letter-spacing**
  (that's −0.05em); section titles at 75px; the "WHO DO WE SERVE" watermark at **165px**; the
  footer's `LET'S CONNECT` at **203px**, outlined, not filled.
- **Colour discipline:** black and white sections alternate, and orange is the *only* saturated
  colour on the entire site. It appears on: the Book A Call pill, module titles, the second half
  of a headline, thin line-art accents, the scroll-to-top button, and one full-bleed contact
  section. That's it. **This restraint is why the orange still has force at 14,000px down.**
- **Ghost/watermark headings:** a huge low-contrast word (`OUR STRATEGY`, `WHY DWY`) sits *behind*
  the real headline. Cheap depth, no images needed.
- **Line-art accents:** hand-made SVG squiggles, dot-grids, funnels, orbit diagrams in orange
  hairlines. They cost nothing and they are the difference between "template" and "designed."
- **Motion:** heavy scroll-triggered reveals — every block fades/slides in, hero words animate in
  staggered, a name marquee loops, stat counters count up.
- **Photography is real and it is unglamorous:** actual TEDx shots, actual cramped office, actual
  workshop rooms. Testimonials are **vertical phone-selfie videos**, badly lit, first names only.
  Nothing is stock. This is the single biggest anti-AI-slop signal on the site.

---

## 5. What is actually *bad* here — do not copy

I want to be direct, because if we imitate this uncritically we inherit real bugs:

1. **The reveal animations break the page.** My first full-page screenshot pass came back
   **entirely black** — every headline, every paragraph, invisible. Content sits at `opacity: 0`
   until a scroll event fires. That's a genuine SEO, accessibility, and no-JS failure, and it means
   a slow connection shows a blank black wall. Our Lenis + framer-motion `Reveal` must always have
   a visible resting state.
2. **The hero headline is broken at 1440px.** "SOLVED FOREVER" literally overlaps and clips —
   `SOLVED FO?R` collides mid-animation. 150px with −0.05em tracking is a hair-trigger; it needs
   real `clamp()` and a tested wrap.
3. **11px paragraph text** in places (measured `11.27px`, `#cccccc` on black). Unreadable.
4. **The stats are unverifiable, and the site knows it** — `$1.5M ... in 2025*`, with an asterisk
   that leads nowhere. `0.6% refund rate` is a strange thing to brag about (it advertises that
   refunds exist). Our `content.js` already carries the hard rule: *"statistics carry a real, named
   source — never publish a bare or unverifiable figure."* **Keep that rule. It is a competitive
   advantage, not a handicap.**
5. **Tone won't transfer.** "We will coach you to Sell, Extremely f\*\*king Well." "This is where we
   turn you into a weapon." That works for a discipline-and-hustle coaching brand sold to 25-year-old
   agency founders. It would actively destroy trust for a company asking an SMB owner to hand over
   the software their business runs on. **Steal the structure and the specificity. Leave the hype.**
6. **A WhatsApp bubble + a scroll-to-top button + a sticky CTA** all floating at once is clutter.
7. **14,000px of homepage.** Ours should say more in less.

---

## 6. Translating this to Pixel Kriti

We already have a better *foundation* than they do — real design tokens, Instrument Serif +
Manrope + JetBrains Mono, an ink/paper system, a single brand green (`#31ae49`), framer-motion,
Lenis, prerendering. What we lack is their **conviction**: their page argues, ours describes.

### 6.1 Structure — restructure the home page as an argument

Adopt their loop, in our voice:

| Freedom Formula | Pixel Kriti equivalent |
|---|---|
| CLIENT ACQUISITION SOLVED FOREVER | A hero that states the *outcome we own*, not what we build. Our best existing line is the consolidation promise: **one system you own instead of thirty you rent.** That is our "solved forever." Put it at display scale. |
| Stat bar (fabricated) | **Proof bar, but honest:** subscriptions replaced, hours returned, systems shipped, years supported — each one sourced, or omitted. If we only have three true numbers, ship three. |
| DWY / DFY fork | **Our self-sort fork.** We badly need one. Something like *"Fix one broken process"* vs *"Replace the whole stack"* — or by stage: a focused build (weeks) vs a platform (phased months). Our FAQ already says exactly this; promote it to a fork on the homepage. |
| Four modules, always in the same order | **Our fixed spine.** We have the pieces scattered — CRM platform, business OS, dashboards, AI sub-agents. Lock them into one named, repeated order and use it on every page. Repetition = system. |
| Who Do We Serve (photo mosaic) | Who it's for, with **real photos of the team and real screens** — never stock, never AI-generated. |
| Selfie-video testimonials | Whatever real proof we have, even if it's one client on a phone camera. One real 40-second clip beats six polished quote cards. |
| Objection FAQ | Rewrite our FAQ as objections: *"We already pay for these tools."* *"What if you disappear?"* *"We're too small for custom software."* *"Isn't this just an n8n workflow?"* Keep two educational ones for first-timers. |
| Repeat the hero line in the footer | Close the loop. Our footer boilerplate is already strong — give it display scale. |

### 6.2 Visual — turn the volume up without changing the palette

- **Go bigger on display type.** Our `--font-display` is Instrument Serif and our display clamp
  tops out at `6.25rem`. Their H1 is 150px. We don't need Oswald's brutalism, but a serif at
  120–150px with tight tracking is *elegant* and confident where 44px is timid. This is the single
  highest-leverage visual change.
- **Adopt the ghost-watermark heading.** A huge `--paper` at ~4% opacity word behind the real
  headline. Free depth, on brand, no images.
- **Ration the green like they ration the orange.** Right now green is "the one saturated colour"
  in the CSS comment — enforce it: primary CTA, one word in one headline, hairline diagrams, one
  full-bleed section. Nothing else.
- **Build our own line-art vocabulary.** They use funnels and orbits because they sell funnels.
  We sell *consolidation* — so: thirty scattered nodes collapsing into one, a stack of subscription
  logos becoming a single block, a data flow. Hairline `--brand-soft` SVG, drawn on scroll. This is
  where we beat them, because it's genuinely bespoke.
- **Alternate ink and paper sections** the way they alternate black and white. We're currently
  ink almost throughout; a full-bleed `--paper` section resets the eye and makes the next dark
  section hit harder.
- **Fix what they broke:** every `Reveal` gets a visible resting state, and the prerendered HTML
  must contain readable text with animations off. Respect `prefers-reduced-motion`.

### 6.3 Anti-"AI-generated" rules

This is what you're really asking for. The tells of an AI-looking site, and the fix:

- **Perfect symmetry and even rhythm.** Every section the same height, same 3-col grid, same card.
  → Vary section height deliberately. Let one section be 40vh and the next 140vh.
- **Stock/AI imagery and generic icon sets.** → Real photos of real people and real screens, or
  bespoke line-art. Nothing from a library.
- **Rounded cards with soft shadows and gradient blobs.** → We already avoid this. Keep avoiding it.
- **Copy that could belong to any company.** "Innovative solutions that empower your business."
  → The `who's not even that good btw` test: would a real person say this out loud? Name specific
  tools, specific hours, specific rupees/dollars, specific 9pm leads.
- **Three identical value props with three identical icons.** → Uneven counts (4 modules, 2 paths,
  9 FAQs). Asymmetry reads as human.
- **Motion that's uniformly `fade-in-up 0.5s` on everything.** → Give different elements different
  behaviour: type reveals by word, diagrams draw their stroke, numbers count, images scale from 1.04.

The three skills you installed cover exactly this ground — `emil-design-eng` and
`animation-vocabulary` for motion craft, `design-taste-frontend` / `high-end-visual-design` for the
visual bar, and `impeccable` for the design-context setup. When we start executing, run
`/impeccable init` first so the design context is written down before any component changes.

---

## 7. The one strategic tension to resolve

Freedom Formula's persuasive engine is **numbers we cannot honestly reproduce** — 97%, 1,750,
$1.5M — and our own code comments explicitly forbid publishing a figure without a real source.

So we cannot win on volume of proof. We have to win on **specificity of proof**: one named client,
one real before/after, one real invoice, one real subscription bill we deleted. Their proof is
loud and thin. Ours should be quiet and thick — and the site should be *built* to showcase a small
number of deep case studies rather than a wall of stats. That's the fork in the road, and I think
it's the right one, because it's the only one that survives a buyer actually checking.

---

## Artifacts from this audit

- `ff/*.json` — computed design tokens, type scale, buttons, headings per page
- `ff/*.txt` — full verbatim copy per page
- `ff/vp/*.png` — viewport-by-viewport screenshots with reveals fired (28 shots)
- `ff/home-mobile.png` — mobile capture
