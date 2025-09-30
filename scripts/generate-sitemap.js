import fs from "fs";
import path from "path";
import { createClient } from "contentful";
import { fileURLToPath } from "url";
import "dotenv/config"; // this loads .env into process.env

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use REACT_APP_ env variables (CRA requires this)
const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
});

console.log(" accesstoken ",process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN);

async function generateSitemap() {
  try {
    const entries = await client.getEntries({ content_type: "blogPost" });

    const urls = entries.items
      .map((item) => {
        const slug = item.fields.slug;
        const updatedAt = item.sys.updatedAt;

        return `
      <url>
        <loc>https://blog.slayitcoder.in/${slug}</loc>
        <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

    // save sitemap to public/ so it’s served statically
    const filePath = path.join(__dirname, "../public/sitemap.xml");
    fs.writeFileSync(filePath, sitemap, "utf8");

    console.log("✅ Sitemap generated at public/sitemap.xml");
  } catch (err) {
    console.error("❌ Error generating sitemap:", err);
  }
}

generateSitemap();
