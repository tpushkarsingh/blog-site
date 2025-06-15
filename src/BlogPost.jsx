  // BlogPost.jsx
  import React, { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
  import { createClient } from "contentful";
  import "./App.css";
  import LikeButton from "./LikeButton"; // adjust path if LikeButton.jsx is in a different folder

  const client = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
  });

  export const previewClient = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_PREVIEW_TOKEN, // Draft content
    host: 'preview.contentful.com',
  });

  export default function BlogPost({ isPreview = false }) {
    const { slug } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
      const clientToUse = isPreview ? previewClient : client;
    
      clientToUse
        .getEntries({
          content_type: "blogPost",
          "fields.slug": slug,
        })
        .then((res) => {
          if (res.items.length) {
            const item = res.items[0];
            const imageId = item.fields.coverImage?.[0]?.sys?.id;
            const imageAsset = res.includes?.Asset?.find((a) => a.sys.id === imageId);
            const postData = {
              ...item.fields,
              coverImageUrl: imageAsset?.fields?.file?.url
                ? "https:" + imageAsset.fields.file.url
                : null,
            };
            setPost(postData);
    
            // ✅ Set the tab title dynamically
            document.title = `${item.fields.title} | SlayItCoder Blog`;
          }
        });
    }, [slug, isPreview]);
    

    if (!post) return <p>Loading...</p>;

    return (
      <div className="blog-container">
        <div className="blog-wrapper">
          <div className="blog-post">
    
            {/* ✅ Top-left aligned inside blog post */}
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
                Published on {new Date(post.publishedDate).toLocaleDateString()}
              </p>
              <LikeButton postId={post.slug} />
            </div>
    
            {post.coverImageUrl && (
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="blog-image"
              />
            )}
    
            <div className="post-content">
              {documentToReactComponents(post.content)}
            </div>
          </div>
        </div>
      </div>
    );    
    
  }
