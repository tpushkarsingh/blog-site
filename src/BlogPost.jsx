// BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { createClient } from "contentful";
import "./App.css";

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
    }
  });

  }, [slug]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="blog-container">
      <div className="blog-wrapper">
        <div className="blog-post">
        {isPreview && <div style={{ color: "orange", marginBottom: "1rem" }}>🟡 Preview Mode</div>}
          <h1 className="post-title">{post.title}</h1>
          <p className="post-date">
            Published on {new Date(post.publishedDate).toLocaleDateString()}
          </p>
          {post.coverImageUrl && (
            <img src={post.coverImageUrl} alt={post.title} className="blog-image" />
          )}
          <div className="post-content">{documentToReactComponents(post.content)}</div>
        </div>
      </div>
    </div>
  );
}
