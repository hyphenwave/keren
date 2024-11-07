import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../src/css/normalize.css";
import "../src/css/webflow.css";
import "../src/css/complain-onchain.webflow.css";
import "../src/css/_main.css";
import ComplaintBox from "./Components/ComplaintBox/ComplaintBox";
import Dashboard from "./Components/Dashboard/Dashboard";
import Homepage from "./Components/Homepage/Homepage";
import Navbar from "./Components/NavBar.jsx";
import NotFound from "./Components/NotFound/NotFound";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import { createClient } from '@supabase/supabase-js';

import config from "./config";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const queryClient = new QueryClient();

const Footer = () => {
  return (
    <section className="footer">
      <div className="c-footer_image">
        <img
          src="images/Keren-Writing-A-Complaint-1.png"
          loading="lazy"
          alt=""
          className="c-image"
        />
      </div>
      <div className="w-layout-vflex c-footer_content">
        <div className="c-footer_title">Complain OnChain</div>
        <div>Family of BasedKeren</div>
        <div>2024</div>
      </div>
    </section>
  );
};

const App = () => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('complaint_boxes')
        .select('slug')
        .order('slug');

      if (error) throw error;

      setRoutes(data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Static routes */}
            <Route
              path="/"
              element={
                <div>
                  <Navbar />
                  <Homepage />
                  <Footer />
                </div>
              }
            />

            <Route
              path="/dashboard"
              element={
                <div className="App">
                  <Navbar />
                  <Dashboard />
                  <Footer />
                </div>
              }
            />

            <Route
              path="/admin"
              element={
                <div className="App">
                  <Navbar />
                  <AdminDashboard />
                  <Footer />
                </div>
              }
            />

            {/* Dynamic routes generated from database */}
            {routes.map(({ slug }) => (
              <Route
                key={slug}
                path={`/${slug}`}
                element={
                  <div className="App">
                    <Navbar />
                    <ComplaintBox recipient={slug} />
                    <Footer />
                  </div>
                }
              />
            ))}

<Route
  path="*"
  element={
    <div className="App">
      <Navbar />
      <NotFound />
      <Footer />
    </div>
  }
/>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// Create root and render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);