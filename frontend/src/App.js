import React from "react";
import { BrowserRouter,Route, Routes } from "react-router-dom";
import "./App.css";
import ComplaintBox from "./Components/ComplaintBox/ComplaintBox";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <img className="titleImage" src="title.png" alt="Title"></img>
            <ComplaintBox></ComplaintBox>
            <Footer />
          </div>
        }
      />
      <Route path="/dashboard" element={
        <div className="App">
        {/* <img className="titleImage" src="title.png" alt="Title"></img> */}
        <Dashboard></Dashboard>
        <Footer />
      </div>
      } />
    </Routes>
    </BrowserRouter>
  );
}

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

export default App; 