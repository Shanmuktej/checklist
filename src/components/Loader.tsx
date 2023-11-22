import { DotLottiePlayer } from "@dotlottie/react-player";
import { Signal, useSignal } from "@preact/signals";

export let showSpinner: Signal<boolean>;

function Loader() {
  showSpinner = useSignal(true);
  return (
    <div
      className={`absolute z-10 h-full w-full flex items-center justify-center z-10 ${
        showSpinner.value ? "fadeIn" : "fadeOut"
      }`}
    >
      <DotLottiePlayer
        src="/checklist/src/images/vegies_walking.lottie"
        className="ml-8"
        autoplay
        loop
      />
    </div>
  );
}

export default Loader;
