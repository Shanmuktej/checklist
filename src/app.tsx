import { DotLottiePlayer } from "@dotlottie/react-player";
import "./app.css";
import List from "./components/ItemList";
import Loader from "./components/Loader";

export function App() {

  return (
    <div style="margin: 0 2%">
      <Loader />
      <header
        className="flex flex-row place-content-center items-center"
        style=" margin: 24px"
      >
        <div id="brand" className="flex items-center">
          <DotLottiePlayer
            src="./assets/check.lottie"
            className="w-10"
            autoplay
            loop
          />
          <h1 className="text-4xl text-teal-400 relative bottom-0.5">Checklist</h1>
        </div>
        <DotLottiePlayer
          src="./assets/foodCart.lottie"
          className="right-8 absolute w-10 rounded-full cursor-pointer"
          size={4}
          style={{ backgroundColor: "#2DD4BF" }}
          autoplay
          loop
        />
      </header>
      <List />
    </div>
  );
}
