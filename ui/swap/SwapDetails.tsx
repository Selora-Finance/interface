export default function SwapDetails() {
  return (
    <div className="bg-[#111111] rounded px-6 py-8 text-sm text-white space-y-4 shadow">
      <div className="flex justify-between">
        <span>Slippage Tolerance</span>
        <span className="text-white">0.5%</span>
      </div>
      <div className="flex justify-between">
        <span>Exchange Rate</span>
        <span className="text-white">--</span>
      </div>
      <div className="flex justify-between">
        <span>Price Impact</span>
        <span className="text-white">0%</span>
      </div>
      <div className="flex justify-between">
        <span>Minimum Received</span>
        <span className="text-white">--</span>
      </div>
      <div className="flex justify-between">
        <span>Router</span>
        <span className="text-[#ADF802]">Auto</span>
      </div>
    </div>
  );
}
