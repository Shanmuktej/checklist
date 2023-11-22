import { DotLottiePlayer } from "@dotlottie/react-player";
import { Signal, useSignal } from "@preact/signals";

export let showSpinner: Signal<boolean>;

function Loader() {
  showSpinner = useSignal(true);
  return (
    <div
      className={`absolute z-10 h-full flex items-center justify-center ${ showSpinner.value ? "fadeIn" : "fadeOut" }`}
      style={{width: "96%"}}
    >
      <DotLottiePlayer
        src="../src/images/vegies_walking.lottie"
        className="ml-8"
        autoplay
        loop
      />
    </div>
  );
}

export default Loader;
