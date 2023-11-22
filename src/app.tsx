import { DotLottiePlayer } from "@dotlottie/react-player";
import List from "./components/List";
import Loader from "./components/Loader";

export function App() {

  return (
    <div>
      <Loader />
      <header className="flex flex-row place-content-center xl:my-24">
        <DotLottiePlayer
          src="/src/images/check.lottie"
          className="h-11 w-11"
          autoplay
          loop
        />
        <h1 className="text-4xl text-teal-400">Checklist</h1>
      </header>
      <List/>
    </div>
  );
}
