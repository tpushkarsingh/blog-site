// BlogList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "contentful";
import { Helmet } from "react-helmet";

import "./App.css";
import NewsletterCTA from "./NewsletterCTA";

/* ---------- Contentful client ---------- */
const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
});

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  /* ---------- Fetch all published posts ---------- */
  useEffect(() => {
    client
      .getEntries({ content_type: "blogPost" })
      .then((res) => {
        const assets = res.includes?.Asset || [];
        const enriched = res.items.map((item) => {
          const imageId     = item.fields.coverImage?.[0]?.sys?.id;
          const imageAsset  = assets.find((a) => a.sys.id === imageId);
          return {
            ...item.fields,
            id: item.sys.id,
            coverImageUrl: imageAsset?.fields?.file?.url
              ? "https:" + imageAsset.fields.file.url
              : null,
          };
        });
        setPosts(enriched);
      })
      .catch(console.error);
  }, []);

  /* ---------- Meta for the listing page ---------- */
  const metaTitle       = "All AI/ML Blogs | SlayItCoder";
  const metaDescription =
    "Browse every beginner-friendly AI & Machine Learning article published on SlayItCoder. New blogs every weekend!";
  const metaUrl   = "https://blog.slayitcoder.in/";
  const metaImage = posts[0]?.coverImageUrl || "/default-thumbnail.png";

  return (
    <>
      {/* SEO & social-share tags */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        {/* Open Graph */}
        <meta property="og:title"       content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={metaUrl} />
        <meta property="og:image"       content={metaImage} />
        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image"       content={metaImage} />
      </Helmet>

      {/* Page markup */}
      <div className="blog-container">
        <div className="blog-wrapper">
          <h1 className="blog-title">All Published Blogs</h1>

          <NewsletterCTA />

          {posts.map((post) => (
            <div key={post.id} className="blog-post">
              <Link to={`/${post.slug}`}>
                <h2 className="post-title">{post.title}</h2>
              </Link>

              <p className="post-excerpt">
                {post.excerpt?.slice(0, 120) || "Read more…"}
              </p>
            </div>
          ))}

          <NewsletterCTA />
        </div>
      </div>
    </>
  );
}
