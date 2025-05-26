// blog-app/src/App.jsx
import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "./App.css";

const SPACE_ID = process.env.REACT_APP_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = process.env.REACT_APP_CONTENTFUL_DELIVERY_TOKEN;

const client = createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN,
});

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .getEntries({ content_type: "blogPost" })
      .then((res) => {
        const assets = res.includes?.Asset || [];
        const enrichedPosts = res.items.map((item) => {
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
        setPosts(enrichedPosts);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="text-center text-lg p-10">Loading...</div>;
  }

  return (
    <div className="blog-container">
      <div className="blog-wrapper">
        <h1 className="blog-title">SlayItCoder Blog</h1>
        {posts.map((post) => (
          <div key={post.id} className="blog-post">
            {post.coverImageUrl && (
              <img src={post.coverImageUrl} alt={post.title} className="blog-image" />
            )}
            <h2 className="post-title">{post.title}</h2>
            <p className="post-date">
              Published on {new Date(post.publishedDate).toLocaleDateString()}
            </p>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="post-content">
              {documentToReactComponents(post.content)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
