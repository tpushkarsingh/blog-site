// BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { createClient } from "contentful";
import { Helmet } from "react-helmet";

import "./App.css";
import LikeButton from "./LikeButton";
import NewsletterCTA from "./NewsletterCTA";

/* ---------- Contentful clients ---------- */
const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
});

export const previewClient = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_PREVIEW_TOKEN,
  host: "preview.contentful.com",
});

export default function BlogPost({ isPreview = false }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  /* ---------- Fetch the post ---------- */
  useEffect(() => {
    const clientToUse = isPreview ? previewClient : client;

    clientToUse
      .getEntries({
        content_type: "blogPost",
        "fields.slug": slug,
        include: 10,
      })
      .then((res) => {
        if (!res.items.length) return;

        const item = res.items[0];

        /* Create a quick asset-lookup table for embedded images */
        const assetsById = {};
        res.includes?.Asset?.forEach((a) => (assetsById[a.sys.id] = a));

        const imageId   = item.fields.coverImage?.[0]?.sys?.id;
        const imageAsset = assetsById[imageId];

        const postData = {
          ...item.fields,
          assetsById,
          coverImageUrl: imageAsset?.fields?.file?.url
            ? "https:" + imageAsset.fields.file.url
            : null,
          coverImageAlt: imageAsset?.fields?.title || item.fields.title,
        };

        setPost(postData);
      });
  }, [slug, isPreview]);

  if (!post) return <p>Loading…</p>;

  /* ---------- Rich-text render options ---------- */
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data.target.sys.id;
        const asset   = post.assetsById?.[assetId];
        const url     = asset?.fields?.file?.url
          ? `https:${asset.fields.file.url}`
          : "";
        const title   = asset?.fields?.title || "Embedded image";

        return url ? (
          <img
            src={url}
            alt={title}
            style={{
              maxWidth: "100%",
              margin: "1rem 0",
              borderRadius: "10px",
              display: "block",
            }}
          />
        ) : null;
      },
      [INLINES.HYPERLINK]: (node, children) => {
      const url = node.data.uri;
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        let embedUrl = url;

        if (url.includes("youtu.be")) {
          embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
        } else if (url.includes("watch?v=")) {
          embedUrl = url.replace("watch?v=", "embed/");
        }
        return (
          <div style={{ margin: "2rem 0", textAlign: "center" }}>
            <iframe
              width="100%"
              height="480"
              src={embedUrl}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "10px" }}
            ></iframe>
          </div>
        );
      }
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    },
  };

  /* ---------- Derive meta values ---------- */
  const metaTitle       = `${post.title} | SlayItCoder`;
  const metaDescription =
    post.summary ||
    post.excerpt ||
    "Learn AI/ML with beginner-friendly blogs on SlayItCoder.";
  const metaUrl   = `https://blog.slayitcoder.in/${post.slug}`;
  const metaImage = post.coverImageUrl || "/default-thumbnail.png";

  /* ---------- Component JSX ---------- */
  return (
    <>
      {/*  SEO & social-share tags  */}
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description"        content={metaDescription} />
        {/* Open Graph */}
        <meta property="og:title"       content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type"        content="article" />
        <meta property="og:url"         content={metaUrl} />
        <meta property="og:image"       content={metaImage} />
        {/* Twitter */}
        <meta name="twitter:card"       content="summary_large_image" />
        <meta name="twitter:title"      content={metaTitle} />
        <meta name="twitter:description"content={metaDescription} />
        <meta name="twitter:image"      content={metaImage} />
      </Helmet>

      {/*  Blog layout  */}
      <div className="blog-container">
        <div className="blog-wrapper">
          <div className="blog-post">
            <div style={{ marginBottom: "1rem" }}>
              <a
                href="https://blog.slayitcoder.in"
                style={{
                  color: "#0070f3",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                ← Back to Blog Home
              </a>
            </div>

            <NewsletterCTA />

            {isPreview && (
              <div style={{ color: "orange", marginBottom: "1rem" }}>
                🟡 Preview Mode
              </div>
            )}

            <h1 className="post-title">{post.title}</h1>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <p className="post-date" style={{ margin: 0 }}>
                Published on{" "}
                {new Date(post.publishedDate).toLocaleDateString()}
              </p>
              <LikeButton postId={post.slug} />
            </div>

            {post.coverImageUrl && (
              <img
                src={post.coverImageUrl}
                alt={post.coverImageAlt}
                className="blog-image"
              />
            )}

            <div className="post-content">
              {documentToReactComponents(post.content, options)}
            </div>

            <NewsletterCTA />
          </div>
        </div>
      </div>
    </>
  );
}
