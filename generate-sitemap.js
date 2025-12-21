/**
 * Sitemap Generator for Florida Autism Services Directory
 *
 * Connects to Supabase and generates sitemap.xml and robots.txt
 * Run with: node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Supabase credentials (from .env.local)
const SUPABASE_URL = 'https://twcofgyxiitfvoedftik.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y29mZ3l4aWl0ZnZvZWRmdGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzAyNzUsImV4cCI6MjA3NTc0NjI3NX0.pkxp6DBSgQykenv2UZIILZhUY9P6xp-lBNs6Z8NNmdI';

const BASE_URL = 'https://floridaautismservices.com';
const OUTPUT_DIR = path.join(__dirname, 'src', 'frontend', 'public');

// Static pages with their priorities
const STATIC_PAGES = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/providers', priority: '0.9', changefreq: 'daily' },
    { path: '/schools', priority: '0.9', changefreq: 'daily' },
    { path: '/faith', priority: '0.8', changefreq: 'weekly' },
    { path: '/events', priority: '0.8', changefreq: 'daily' },
    { path: '/blog', priority: '0.7', changefreq: 'weekly' },
    { path: '/guides', priority: '0.7', changefreq: 'weekly' },
    { path: '/educational-resources', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.5', changefreq: 'monthly' },
    { path: '/contact', priority: '0.5', changefreq: 'monthly' },
    { path: '/donate', priority: '0.6', changefreq: 'monthly' },
    { path: '/submit-resource', priority: '0.4', changefreq: 'monthly' },
    { path: '/submit-event', priority: '0.4', changefreq: 'monthly' },
];

/**
 * Fetch all rows from a Supabase table with pagination
 */
async function fetchAllSlugs(tableName, slugColumn = 'slug') {
    const slugs = [];
    let from = 0;
    const pageSize = 1000;

    console.log(`Fetching ${tableName}...`);

    while (true) {
        const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=${slugColumn}&${slugColumn}=not.is.null&order=${slugColumn}&offset=${from}&limit=${pageSize}`;

        const response = await fetch(url, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            }
        });

        if (!response.ok) {
            console.error(`Error fetching ${tableName}: ${response.status} ${response.statusText}`);
            break;
        }

        const data = await response.json();

        if (!data || data.length === 0) break;

        for (const row of data) {
            if (row[slugColumn]) {
                slugs.push(row[slugColumn]);
            }
        }

        console.log(`  Fetched ${slugs.length} ${tableName} slugs so far...`);

        if (data.length < pageSize) break;
        from += pageSize;
    }

    console.log(`  Total: ${slugs.length} ${tableName} slugs`);
    return slugs;
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(loc, lastmod, changefreq, priority) {
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate the complete sitemap XML
 */
function generateSitemapXml(urls) {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const footer = `
</urlset>`;

    return header + '\n' + urls.join('\n') + footer;
}

/**
 * Generate robots.txt content
 */
function generateRobotsTxt() {
    return `# robots.txt for Florida Autism Services Directory
# https://floridaautismservices.com

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml
`;
}

/**
 * Main function
 */
async function main() {
    console.log('Starting sitemap generation...\n');

    const today = new Date().toISOString().split('T')[0];
    const urls = [];

    // Add static pages
    console.log('Adding static pages...');
    for (const page of STATIC_PAGES) {
        urls.push(generateUrlEntry(
            `${BASE_URL}${page.path}`,
            today,
            page.changefreq,
            page.priority
        ));
    }
    console.log(`  Added ${STATIC_PAGES.length} static pages\n`);

    // Fetch and add provider pages
    const providerSlugs = await fetchAllSlugs('resources', 'slug');
    for (const slug of providerSlugs) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/providers/${slug}`,
            today,
            'weekly',
            '0.7'
        ));
    }
    console.log('');

    // Fetch and add school pages
    const schoolSlugs = await fetchAllSlugs('schools', 'slug');
    for (const slug of schoolSlugs) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/schools/${slug}`,
            today,
            'weekly',
            '0.7'
        ));
    }
    console.log('');

    // Fetch and add church pages
    const churchSlugs = await fetchAllSlugs('churches', 'slug');
    for (const slug of churchSlugs) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/churches/${slug}`,
            today,
            'weekly',
            '0.6'
        ));
    }
    console.log('');

    // Fetch and add blog post pages
    const blogSlugs = await fetchAllSlugs('blog_posts', 'slug');
    for (const slug of blogSlugs) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/blog/${slug}`,
            today,
            'monthly',
            '0.6'
        ));
    }
    console.log('');

    // Fetch and add event pages
    const eventSlugs = await fetchAllSlugs('events', 'slug');
    for (const slug of eventSlugs) {
        urls.push(generateUrlEntry(
            `${BASE_URL}/events/${slug}`,
            today,
            'weekly',
            '0.5'
        ));
    }
    console.log('');

    // Generate sitemap XML
    const sitemapXml = generateSitemapXml(urls);

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write sitemap.xml
    const sitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml);
    console.log(`Sitemap written to: ${sitemapPath}`);

    // Write robots.txt
    const robotsPath = path.join(OUTPUT_DIR, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt);
    console.log(`Robots.txt written to: ${robotsPath}`);

    // Summary
    console.log('\n=== Summary ===');
    console.log(`Total URLs in sitemap: ${urls.length}`);
    console.log(`  - Static pages: ${STATIC_PAGES.length}`);
    console.log(`  - Provider pages: ${providerSlugs.length}`);
    console.log(`  - School pages: ${schoolSlugs.length}`);
    console.log(`  - Church pages: ${churchSlugs.length}`);
    console.log(`  - Blog pages: ${blogSlugs.length}`);
    console.log(`  - Event pages: ${eventSlugs.length}`);
    console.log('\nDone!');
}

main().catch(console.error);
