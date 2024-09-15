import React from "react";
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

import config from "./config";
import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

const Footer = () => {
  return (
   <section className="footer">
        <div className="c-footer_image"><img src="images/Keren-Writing-A-Complaint-1.png" loading="lazy" alt="" className="c-image" /></div>
        <div className="w-layout-vflex c-footer_content">
          <div className="c-footer_title">Complain OnChain</div>
          <div>Family of BasedKeren</div>
          <div>2024</div>
        </div>
      </section>
  );
};




root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
      <div>
      <Navbar/>
            <Homepage/>
                 <Footer />  
      </div>
          }
           />
          <Route
            path="/jesse"
            element={
              <div className="App">
                <ComplaintBox recipient="jesse" />
                <Footer />
              </div>
            }
          />
          <Route
            path="/brian"
            element={
              <div className="App">
                <ComplaintBox recipient="brian" />
                <Footer />
              </div>
            }
          />

          <Route
            path="/basedmerch"
            element={
              <div className="App">
              
                <ComplaintBox recipient="basedmerch" />
                <Footer />
              </div>
            }
          />

          <Route
            path="/mykcryptodev"
            element={
              <div className="App">
                <ComplaintBox recipient="mykcryptodev" />
                <Footer />
              </div>
            }
          />

          {/* <Route
            path="/boris"
            element={
              <div className="App">
                <ComplaintBox recipient="Boris" />
                <Footer />
              </div>
            }
          /> */}

<Route
            path="/tybg"
            element={
              <div className="App">
                <ComplaintBox recipient="tybg" />
                <Footer />
              </div>
            }
          />

<Route
            path="/pokpok"
            element={
              <div className="App">
              
                <ComplaintBox recipient="PokPok" />
                <Footer />
              </div>
            }
          />

          <Route
            path="/dashboard"
            element={
              <div className="App">
                    <Navbar/>
                <Dashboard />
                <Footer />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </WagmiProvider>
);
