import React from "react";

export default function NewsletterCTA() {
  const handleClick = () => {
    if (window.gtag) {
      window.gtag("event", "newsletter_click", {
        event_category: "engagement",
        event_label: "Substack CTA",
      });
    }
  };

  return (
    <div style={{
      backgroundColor: "#f5f5f5",
      border: "1px solid #ddd",
      padding: "1rem",
      textAlign: "center",
      borderRadius: "8px",
      marginTop: "2rem"
    }}>
      💌 Want more AI/ML content like this every weekend?{" "}
      <a
        href="https://substack.com/@slayitcoder"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        style={{ color: "#0070f3", fontWeight: "500" }}
      >
        Subscribe to the SlayItCoder Newsletter
      </a>
    </div>
  );
}
