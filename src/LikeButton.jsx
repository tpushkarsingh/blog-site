import React, { useState, useEffect } from "react";
import { FaHeart, FaRegSmileBeam } from "react-icons/fa";


export default function LikeButton({ postId }) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`liked-${postId}`);
    if (saved === "true") setLiked(true);

    const savedCount = localStorage.getItem(`likes-${postId}`);
    if (savedCount) setLikeCount(parseInt(savedCount));
  }, [postId]);

  const handleLike = () => {
    if (!liked) {
      console.log('Thanks for linking. Happy learning !')  
      const newCount = likeCount + 1;
      setLikeCount(newCount);
      setLiked(true);
      if (window.gtag) {
        window.gtag("event", "like_button_click", {
          event_category: "engagement",
          event_label: "Blog Like",
          value: 1,
        });
      }
      localStorage.setItem(`liked-${postId}`, "true");
      localStorage.setItem(`likes-${postId}`, newCount.toString());
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <button
        onClick={handleLike}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.25rem",
          color: liked ? "#e63946" : "#ccc",
          transition: "color 0.3s ease"
        }}
        aria-label="Like post"
      >
        <FaHeart />
      </button>
      <span style={{ fontSize: "0.8rem", color: "#666" }}> Share love <FaRegSmileBeam />
      </span>
    </div>
  );
}
