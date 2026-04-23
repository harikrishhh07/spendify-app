import React, { useEffect, useState } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col items-end gap-1 px-2">
      <div className="font-mono text-lg font-bold text-white tracking-wide">
        {formatTime(time)}
      </div>
      <div className="font-label-caps text-[10px] text-white/60">
        {formatDate(time)}
      </div>
    </div>
  );
}
