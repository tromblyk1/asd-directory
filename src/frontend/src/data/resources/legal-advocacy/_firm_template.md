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
  "startsOn": "2026-05-15",
  "expiresOn": "2027-05-15"
}
```

Notes:
- All outbound sponsor links on the live site automatically get `rel="sponsored noopener noreferrer"`, per Google Webmaster Guidelines.
- Each card is clearly labeled "Sponsored Resource" per FTC and Florida Bar Rule 4-7.
- `startsOn` and `expiresOn` are advisory — they don't auto-hide the card. Set a calendar reminder to renew or remove.
