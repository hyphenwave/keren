import "./App.css";
import ComplaintBox from "./Components/ComplaintBox/ComplaintBox";

function App() {
  return (
    <div className="App">
      <img className="titleImage" src="title.png" alt="Title"></img>

      <ComplaintBox></ComplaintBox>

      <div className="Footer">
        <a href="https://www.basedkeren.com/" className="webLink">Keren Website</a>
        <a href="https://t.me/kerenbase">Telegram</a>
        <a href="https://dexscreener.com/base/0x1ca25a133160beb02b18c1983c997fafbe98bc6e">Chart</a>
        <a href="https://warpcast.com/basedkeren">Warpcast</a>
        <a href="https://www.dextools.io/app/en/base/pair-explorer/0x1ca25a133160beb02b18c1983c997fafbe98bc6e?t=1715622444271">Video Tutorial</a>
      </div>
    </div>
  );
}

export default App;
