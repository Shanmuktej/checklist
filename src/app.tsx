import { DotLottiePlayer } from "@dotlottie/react-player";
import List from "./components/List";
import Loader from "./components/Loader";

export function App() {

  return (
    <div style="margin: 0 2%">
      <Loader />
      <header
        className="flex flex-row place-content-center xl:my-24"
        style=" margin: 24px"
      >
        <DotLottiePlayer
          src="/src/assets/check.lottie"
          className="h-11 w-11"
          autoplay
          loop
        />
        <h1 className="text-4xl text-teal-400">Checklist</h1>
      </header>
      <List />
    </div>
  );
}
