// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import BlogList from "./BlogList";
import BlogPost from "./BlogPost";


function LinkTargetSetter() {
  const location = useLocation();
  React.useEffect(() => {
    const links = document.querySelectorAll("a[href]");
    links.forEach(link => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }, [location]);
  return null;
}

export default function App() {
  
  return (
    <>
      {/* ------------ Global <head> tags ------------ */}
      <Helmet>
        {/* Primary meta */}
        <title>SlayItCoder Blog | AI & ML Explained Simply</title>
        <meta
          name="description"
          content="Weekly, beginner-friendly articles that turn complex AI/ML ideas into clear, hands-on lessons."
        />

        {/* Open Graph (default for the whole site) */}
        <meta property="og:title" content="SlayItCoder Blog" />
        <meta
          property="og:description"
          content="Decode AI & Machine Learning with visual, practical tutorials."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blog.slayitcoder.in/" />
        <meta property="og:image" content="/default-thumbnail.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SlayItCoder Blog" />
        <meta
          name="twitter:description"
          content="Visual, weekend-friendly AI/ML breakdowns."
        />
        <meta name="twitter:image" content="/default-thumbnail.png" />

        {/* Google Analytics (G-tag) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6GZ765LX4T" />
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6GZ765LX4T', {
              cookie_flags: 'SameSite=None;Secure',
              cookie_domain: '.slayitcoder.in'
            });
          `}
        </script>
      </Helmet>

      {/* ------------ Routes ------------ */}
      <Router>
        <LinkTargetSetter />
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/preview" element={<BlogList isPreview={true} />} />
          <Route path="/:slug" element={<BlogPost isPreview={false} />} />
          <Route path="/:slug/preview" element={<BlogPost isPreview={true} />} />
        </Routes>
      </Router>
    </>
  );
}
