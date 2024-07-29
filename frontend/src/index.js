import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import ComplaintBox from "./Components/ComplaintBox/ComplaintBox";
import Dashboard from "./Components/Dashboard/Dashboard";
import Homepage from "./Components/Homepage/Homepage";
import config from "./config";
import { WagmiProvider } from "wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

const Footer = () => {
  return (
    <div className="Footer">
      <a href="https://www.basedkeren.com/" className="webLink">
        Keren Website
      </a>
      <a href="https://t.me/kerenbase">Telegram</a>
      <a href="https://dexscreener.com/base/0x1ca25a133160beb02b18c1983c997fafbe98bc6e">
        Chart
      </a>
      <a href="https://warpcast.com/basedkeren">Warpcast</a>
      <a href="https://www.dextools.io/app/en/base/pair-explorer/0x1ca25a133160beb02b18c1983c997fafbe98bc6e?t=1715622444271">
        Video Tutorial
      </a>
      <a href="/dashboard">Dashboard</a>
    </div>
  );
};

root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>} />
          <Route
            path="/jesse"
            element={
              <div className="App">
                <img className="titleImage" src="title.png" alt="Title" />
                <ComplaintBox recipient="Jesse" />
                <Footer />
              </div>
            }
          />
          <Route
            path="/brian"
            element={
              <div className="App">
                <img className="titleImage" src="title.png" alt="Title" />
                <ComplaintBox recipient="Brian" />
                <Footer />
              </div>
            }
          />

          <Route
            path="/basedmerch"
            element={
              <div className="App">
                <img className="titleImage" src="title.png" alt="Title" />
                <ComplaintBox recipient="BasedMerch" />
                <Footer />
              </div>
            }
          />

          <Route
            path="/mykcryptodev"
            element={
              <div className="App">
                <img className="titleImage" src="title.png" alt="Title" />
                <ComplaintBox recipient="Mykcryptodev" />
                <Footer />
              </div>
            }
          />

          {/* <Route
            path="/boris"
            element={
              <div className="App">
                <img className="titleImage" src="title.png" alt="Title" />
                <ComplaintBox recipient="Boris" />
                <Footer />
              </div>
            }
          /> */}

<Route
            path="/tybg"
            element={
              <div className="App">
                <img className="titleImage" src="title.png" alt="Title" />
                <ComplaintBox recipient="TYBG" />
                <Footer />
              </div>
            }
          />

<Route
            path="/pokpok"
            element={
              <div className="App">
                <img className="titleImage" src="title.png" alt="Title" />
                <ComplaintBox recipient="PokPok" />
                <Footer />
              </div>
            }
          />

          <Route
            path="/dashboard"
            element={
              <div className="App">
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
