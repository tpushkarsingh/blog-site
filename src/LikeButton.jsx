import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  /* restore state from localStorage */
  useEffect(() => {
    setLiked(localStorage.getItem(`liked-${postId}`) === "true");
  }, [postId]);

  const handleLike = () => {
    if (liked) return;                      // already liked on this device
    setLiked(true);
    localStorage.setItem(`liked-${postId}`, "true");
  };

  return (
    <button
      onClick={handleLike}
      aria-label={liked ? "You liked this post" : "Like this post"}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      {liked ? (
        <FaHeart style={{ color: "#e11d48", fontSize: "1.5rem" }} /> // filled red
      ) : (
        <FaRegHeart style={{ color: "#64748b", fontSize: "1.5rem" }} /> // blank outline
      )}
    </button>
  );
}
