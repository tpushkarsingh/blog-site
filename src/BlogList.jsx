// BlogList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "contentful";
import "./App.css";

const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN,
});

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    client
      .getEntries({ content_type: "blogPost" })
      .then((res) => {
        const assets = res.includes?.Asset || [];
        const enriched = res.items.map((item) => {
          const imageId = item.fields.coverImage?.[0]?.sys?.id;
          const imageAsset = assets.find((a) => a.sys.id === imageId);
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

  return (
    <div className="blog-container">
      <div className="blog-wrapper">
        <h1 className="blog-title">All Published Blogs</h1>
        {posts.map((post) => (
          <div key={post.id} className="blog-post">
            <Link to={`/${post.slug}`}>
              <h2 className="post-title">{post.title}</h2>
            </Link>
            <p className="post-excerpt">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
