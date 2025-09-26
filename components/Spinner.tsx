interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Spinner({ size = 'sm' }: SpinnerProps) {
  return (
    <div
      className={`border-4 ${
        size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-18 h-18' : 'w-24 h-24'
      } border-emerald-300 border-t-transparent animate-spin rounded-full`}
    />
  );
}
