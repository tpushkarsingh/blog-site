// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./BlogList";
import BlogPost from "./BlogPost";

export default function App() {
  useEffect(() => {
    // Load gtag script
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-6GZ765LX4T";
    script.async = true;
  
    script.onload = () => {
      // Only initialize once the script has loaded
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
  
      gtag("js", new Date());
      gtag("config", "G-6GZ765LX4T", {
        debug_mode: true,
        cookie_flags: "SameSite=None;Secure",
        cookie_domain: ".slayitcoder.in",
      });
  
      console.log("Google Analytics initialized");
    };
  
    document.head.appendChild(script);
  }, []);
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/:slug" element={<BlogPost isPreview={false} />} />
        <Route path="/:slug/preview" element={<BlogPost isPreview={true} />} />
      </Routes>
    </Router>
  );
}
