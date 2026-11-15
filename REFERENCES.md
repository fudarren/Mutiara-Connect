# References and AI use

## Technical references

The project implementation follows the official documentation for the tools used in the codebase:

1. Next.js. (n.d.). *Next.js documentation: App Router*. https://nextjs.org/docs/app
2. React. (n.d.). *React documentation*. https://react.dev/reference/react
3. Tailwind CSS. (n.d.). *Tailwind CSS documentation*. https://tailwindcss.com/docs
4. Leaflet. (n.d.). *Leaflet documentation*. https://leafletjs.com/reference.html
5. Mozilla Developer Network. (n.d.). *Web accessibility and HTML reference*. https://developer.mozilla.org/docs/Web

These sources were used for framework conventions, component APIs, responsive styling, interactive maps, semantic HTML, and accessibility patterns. They are not presented as sources for real-world construction data.

## Project and content references

The portal content in this prototype is local demonstration data. Construction updates, dates, locations, notifications, complaints, and administrative records are mock records defined in the `lib/` files and are not verified public information. Any production release should replace these records with cited, verified sources such as official Penang LRT, Penang state government, or public works announcements.

## AI tools and usage disclosure

Generative AI tools were used as development assistants during this project. ChatGPT/Codex was used to:

- explain and troubleshoot Next.js, React, Tailwind CSS, and responsive layout behavior;
- suggest component and CSS changes for the mobile header, information bar, and page typography;
- review implementation details and propose verification steps;
- help draft and refine documentation wording.

The developer made the final design and implementation decisions, integrated the changes into the repository, reviewed the generated suggestions, and verified the project with `npm run lint` and `npm run build`. AI output was treated as assistance and was not used as an authoritative source for Penang LRT facts.

### Notification module prompt log

The following are polished versions of the prompts used for the notification and notification-header work. They are written in a form suitable for an AI-use disclosure in a project report:

1. **Responsive notification layout diagnosis and correction**

   > Audit the mobile notification layout in this Next.js application. Identify the source of the vertical gap between the fixed portal header and the blue notification information bar, taking into account responsive breakpoints, fixed positioning, content offsets, and mobile browser viewport behavior. Implement the smallest maintainable change that makes the bar sit directly below the header without affecting the desktop layout.

2. **Notification control alignment across mobile breakpoints**

   > Refine the responsive portal header so the brand identity, unread-notification bell, and mobile navigation control remain horizontally and vertically aligned at narrow viewport widths. Preserve the existing unread badge, accessible labels, click behavior, and desktop header spacing. Avoid introducing a second header row or a layout shift when the viewport changes.

3. **Persistent notification information bar**

   > Update the notification information bar so it remains visible directly beneath the portal header while the main page content scrolls. Use an appropriate sticky or fixed positioning strategy, maintain its place in the document flow, prevent duplicate spacing, and ensure the bar does not cover page content or mobile navigation overlays.

4. **Notification UI verification**

   > Review the notification header changes for responsive regressions. Check mobile and desktop positioning, unread-badge visibility, keyboard focus behavior, accessible names, scrolling interaction, and spacing around the information bar. Run the project lint and production build commands, report any failures, and keep unrelated components unchanged.

## Citation note

References should be updated when external images, datasets, icons, copied code, or verified public information are added. Each such item should be cited near its use or listed here with its title, publisher, URL, and access date where required by the assessment format.
