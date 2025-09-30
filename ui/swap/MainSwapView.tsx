"use client";

import { useEffect, useState } from "react";
import TokenDropdown, { Token } from "@/components/TokenDropdown";

const TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", logo: "/eth.png" },
  { symbol: "BTC", name: "Bitcoin", logo: "/btc.png" },
  { symbol: "USDT", name: "Tether", logo: "/usdt.png" },
  { symbol: "BNB", name: "BNB", logo: "/bnb.png" },
  { symbol: "TEOS", name: "Tezos", logo: "/teos.png" },
];

export default function MainSwapView() {
  const [sellToken, setSellToken] = useState("BNB");
  const [buyToken, setBuyToken] = useState("TEOS");
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [editing, setEditing] = useState<"sell" | "buy" | null>(null);
  const [flipped, setFlipped] = useState(false);

  const prices: Record<string, number> = {
    ETH: 1800,
    BTC: 27000,
    USDT: 1,
    BNB: 300,
    TEOS: 2.5,
  };

  // AutoCalc
  useEffect(() => {
    if (editing === "sell") {
      const s = parseFloat(sellAmount);
      if (!sellAmount || isNaN(s)) return setBuyAmount("");
      const raw = (s * (prices[sellToken] ?? 1)) / (prices[buyToken] ?? 1);
      setBuyAmount(Number.isFinite(raw) ? raw.toFixed(6) : "");
    } else if (editing === "buy") {
      const b = parseFloat(buyAmount);
      if (!buyAmount || isNaN(b)) return setSellAmount("");
      const raw = (b * (prices[buyToken] ?? 1)) / (prices[sellToken] ?? 1);
      setSellAmount(Number.isFinite(raw) ? raw.toFixed(6) : "");
    }
  }, [sellAmount, buyAmount, sellToken, buyToken, editing]);

  function flipTokens() {
    // Swap tokens and amounts
    const tempToken = sellToken;
    const tempAmount = sellAmount;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);

    setFlipped(!flipped);
  }

  function renderBox(label: string, token: string, setToken: any, amount: string, setAmount: any) {
    return (
      <div className="transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-200 text-sm">{label}</span>
          <span className="text-xs text-gray-300">
            ${(parseFloat(amount || "0") * (prices[token] ?? 0)).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center border border-gray-700 rounded px-3 py-2 bg-[#111111] gap-2">
          <TokenDropdown tokens={TOKENS} value={token} onChange={setToken} />
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onFocus={() => setEditing(label.toLowerCase() as "sell" | "buy")}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="flex-1 text-right text-gray-500 outline-none placeholder-gray-200 bg-transparent"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-[#1F1F1F] rounded shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <h2 className="text-gray-300 text-lg font-medium">Swap</h2>
        <img src="./setting.png" alt="Swap Icon" className="w-4 h-4 cursor-pointer" />
       
        <div className="text-xs text-gray-300">Balance: 0.0 {flipped ? buyToken : sellToken}</div>
      </div>

      
      <div className="flex flex-col space-y-3">
        {flipped
          ? renderBox("Buy", buyToken, setBuyToken, buyAmount, setBuyAmount)
          : renderBox("Sell", sellToken, setSellToken, sellAmount, setSellAmount)}

        {/* Flip Button  */}
        <div className="flex justify-center my-4 z-10">
          <button
            onClick={flipTokens}
            aria-label="Flip tokens"
            className={`bg-gray-500 hover:bg-gray-400 rounded-full p-2 shadow transform transition-transform duration-300 ${
              flipped ? "rotate-180" : ""
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-800">
              <path d="M7 7v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 17V11h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {flipped
          ? renderBox("Sell", sellToken, setSellToken, sellAmount, setSellAmount)
          : renderBox("Buy", buyToken, setBuyToken, buyAmount, setBuyAmount)}
      </div>

      {/* Connect Wallet */}
      <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded py-3 transition">
        Connect Wallet
      </button>
    </div>
  );
}
