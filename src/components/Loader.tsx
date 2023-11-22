// import { DotLottiePlayer } from "@dotlottie/react-player";
import { Signal, useSignal } from "@preact/signals";

export let showSpinner: Signal<boolean>;

function Loader() {
  showSpinner = useSignal(true);
  return (
    <div
      className={`absolute z-10 flex items-center justify-center ${ showSpinner.value ? "fadeIn" : "fadeOut" }`}
      style={{height: "92%", width: "96%"}}
    >
      {/* <DotLottiePlayer
        src="/src/assets/vegies_walking.lottie"
        className="ml-8"
        autoplay
        loop
      /> */}
    </div>
  );
}

export default Loader;
