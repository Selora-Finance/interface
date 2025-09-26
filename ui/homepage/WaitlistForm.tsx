'use client';

import { Button, Spinner } from '@/components';
import { Themes } from '@/constants';
import { themeAtom } from '@/store';
import { useAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';

interface WaitlistFormProps {
  onSubmit?: (email: string) => void;
  isLoading?: boolean;
}

export default function WaitlistForm({ onSubmit, isLoading }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [theme] = useAtom(themeAtom);
  const isDarkMode = useMemo(() => theme === Themes.DARK, [theme]);

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
        className={`w-full px-6 py-7 bg-transparent border border-[#FF4500] rounded-md ${
          isDarkMode ? 'text-white' : 'text-black'
        } focus:outline-none focus:ring-2 focus:ring-[#FF4500]`}
      />

      {/* Button */}
      <Button
        type="submit"
        className="w-full text-white font-medium py-7 rounded-md transition-all hover:bg-orange-500 flex justify-center gap-3 cursor-pointer"
      >
        Join Waitlist
        {isLoading && <Spinner size="sm" />}
      </Button>
    </form>
  );
}
