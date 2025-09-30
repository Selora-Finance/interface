import MainSwapView from "./MainSwapView";
import SwapDetails from "./SwapDetails";

export default function SwapPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#111111] overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-600 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8">
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
