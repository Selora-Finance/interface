'use client';

import { useCallback, useState } from 'react';

interface WaitlistFormProps {
  onSubmit?: (email: string) => void;
}

export default function WaitlistForm({ onSubmit }: WaitlistFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit) onSubmit(email);
      setEmail('');
    },
    [email, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <h2 className="text-center text-xl font-semibold mb-9 mt-8">Join The Waitlist</h2>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-6 py-7 bg-transparent border border-[#FF4500] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-orange-600 text-white font-medium py-7 rounded-md transition-all hover:bg-orange-500"
      >
        Join Waitlist
      </button>
    </form>
  );
}
