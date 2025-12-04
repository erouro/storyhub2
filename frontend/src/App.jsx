import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import StoryPage from "./pages/StoryPage";
import Donate from "./pages/Donate";
import Subscribe from "./pages/Subscribe";
import PremiumStories from "./pages/PremiumStories";
import SubmitStory from "./pages/SubmitStory";
import AdminLogin from "./admin/AdminLogin";
import AdminStories from "./admin/AdminStories";
import AdminCategories from "./admin/AdminCategories";
import AdminSubscribers from "./admin/AdminSubscribers";

export default function App(){
  return (
    <BrowserRouter>
      <Header />
      <div className="container" style={{paddingTop:12}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/story/:id" element={<StoryPage/>} />
          <Route path="/donate" element={<Donate/>} />
          <Route path="/subscribe" element={<Subscribe/>} />
          <Route path="/premium-stories" element={<PremiumStories/>} />
          <Route path="/submit-story" element={<SubmitStory/>} />

          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin/stories" element={<AdminStories/>} />
          <Route path="/admin/categories" element={<AdminCategories/>} />
          <Route path="/admin/subscribers" element={<AdminSubscribers/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
import Header from "./components/Header";
import CategoryPage from "./pages/CategoryPage";
import StoryPage from "./pages/StoryPage"; // must exist

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<Home />} />
        <Route path="/popular" element={<Home />} />

        <Route path="/story/:id" element={<StoryPage />} />

        {/* CATEGORY ROUTE */}
        <Route path="/category/:name" element={<CategoryPage />} />

        {/* ADMIN ROUTES here */}
      </Routes>
    </>
  );
}
