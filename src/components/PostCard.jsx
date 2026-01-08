import React from "react";

export default function PostCard({ post, onOpen }) {
  return (
    <button
      className="postCard"
      onClick={() => onOpen(post)}
      aria-label={post.title}
    >
      <div className="postCardInner">
        <div className="postCover">
          <div className="postEmoji">{post.coverEmoji || "📌"}</div>
        </div>
      </div>
    </button>
  );
}
