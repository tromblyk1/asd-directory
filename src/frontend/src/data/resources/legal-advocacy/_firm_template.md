# How to add a sponsored firm to a topic page

When a firm pays for a Sponsored Resource Listing, open the matching topic JSON
(e.g. `driving-with-autism.json`) and add an entry to the `sponsoredResources`
array using this shape:

```json
{
  "name": "Payer Law Group",
  "tagline": "Personal injury attorneys serving Florida families",
  "city": "Orlando, FL",
  "blurb": "Comprehensive guide for autism families on driving safety, sensory considerations, traffic stops, and what to do after an accident.",
  "guideTitle": "Guide to Driving with Autism",
  "guideUrl": "https://www.payerlawgroup.com/guide-to-driving-with-autism/",
  "websiteUrl": "https://www.payerlawgroup.com/",
  "logoUrl": "/images/Partners/payer/payer-law-logo.webp",
  "logoDarkBg": true,
  "startsOn": "2026-05-15",
  "expiresOn": "2027-05-15"
}
```

Notes:
- `logoUrl` is optional — put the logo file in `src/frontend/public/images/Partners/<firm>/` so it deploys with the site (don't hotlink the firm's server).
- `logoDarkBg: true` renders the logo on a dark slate chip — use for white/light logo variants (e.g. Payer's white wordmark). Omit or false for dark logos, which get a white chip with border.
- All outbound sponsor links on the live site automatically get `rel="sponsored noopener noreferrer"`, per Google Webmaster Guidelines.
- Each card is clearly labeled "Sponsored Resource" per FTC and Florida Bar Rule 4-7.
- `startsOn` and `expiresOn` are advisory — they don't auto-hide the card. Set a calendar reminder to renew or remove.
