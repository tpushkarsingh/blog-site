// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./BlogList";
import BlogPost from "./BlogPost";

export default function App() {
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
