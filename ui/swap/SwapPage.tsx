import MainSwapView from "./MainSwapView";
import SwapDetails from "./SwapDetails";

export default function SwapPage() {
  return (
    <div className="relative min-h-screen w-full flex justify-center items-start bg-[#111111] overflow-hidden">
      {/* Optional decorative circles */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#222222] opacity-30" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#333333] opacity-30" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8 mt-50 pb-20">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-white">Selora Finance</h1>
        </header>

        <main>
          <MainSwapView />
          <div className="mt-4">
            <SwapDetails />
          </div>
        </main>
      </div>
    </div>
  );
}
