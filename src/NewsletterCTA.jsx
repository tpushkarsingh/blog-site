// NewsletterCTA.jsx
import React from "react";

/**
 * Reusable newsletter call-to-action.
 *  • Uses <section> + hidden heading for semantics/SEO
 *  • Correct Substack URL: https://slayitcoder.substack.com
 *  • aria-label on the link for screen-readers
 *  • Same GA event on click
 */
export default function NewsletterCTA() {
  const handleClick = () => {
    window?.gtag?.("event", "newsletter_click", {
      event_category: "engagement",
      event_label: "Substack CTA",
    });
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      style={{
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
        padding: "1rem",
        textAlign: "center",
        borderRadius: "8px",
        marginTop: "2rem",
      }}
    >
      {/* Visually hidden heading improves document outline */}
      <h2 id="newsletter-heading" style={{ position: "absolute", left: "-9999px" }}>
        Subscribe to the SlayItCoder newsletter
      </h2>

      <p style={{ margin: 0 }}>
        💌 Want more AI/ML content every weekend?{" "}
        <a
          href="https://slayitcoder.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          aria-label="Subscribe to the SlayItCoder newsletter on Substack (opens in new tab)"
          style={{ color: "#0070f3", fontWeight: 500 }}
        >
          Subscribe to the SlayItCoder Newsletter
        </a>
      </p>
    </section>
  );
}
