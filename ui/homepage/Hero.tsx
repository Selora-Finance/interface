"use client";

import { useState } from "react";
import { Button } from "../../components/Button";
import Modal from "../../components/Modal";
import WaitlistForm from "../../components/WaitlistForm";

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWaitlistSubmit = (email: string) => {
    console.log("Email submitted:", email);
    setIsOpen(false);
  };

  return (
    <section className="text-center py-20 relative overflow-hidden w-full">
      {/* Background circles */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Heading */}
      <h1 className="text-3xl md:text-5xl font-extrabold max-w-3xl mx-auto text-[#fff]">
        The Central Trading & Liquidity Marketplace on Fluent
      </h1>
      <p className="mt-4 text-lg text-[#fff] max-w-2xl mx-auto">
        Selora is a ve(3,3) AMM powering sustainable liquidity, governance, and incentives on Fluent network.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4 w-full flex-col md:flex-row">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full md:w-1/7 py-4"
        >
          Join Waitlist
        </Button>
        <Button className="w-full md:w-1/7 py-3">Read Docs</Button>
      </div>

      {/* Modal with reusable WaitlistForm */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <WaitlistForm onSubmit={handleWaitlistSubmit} />
      </Modal>
    </section>
  );
}
