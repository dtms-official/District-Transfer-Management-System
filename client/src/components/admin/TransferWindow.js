import React, { useState, useEffect } from 'react';

export default function TransferWindow() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timer, setTimer] = useState({
    start: null,
    end: null,
  });

  const handleAdd = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const now = Date.now();

      setTimer({
        start: start > now ? start - now : 0,
        end: end > now ? end - now : 0,
      });
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => ({
        start: prev.start > 0 ? prev.start - 1000 : 0,
        end: prev.end > 0 ? prev.end - 1000 : 0,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Transfer Window</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block mb-4">
          <span className="text-gray-700">Start Date:</span>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">End Date:</span>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded"
          />
        </label>
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg text-gray-700">Time until Start Date: <span className="font-semibold">{formatTime(timer.start)}</span></p>
        <p className="text-lg text-gray-700 mt-2">Time until End Date: <span className="font-semibold">{formatTime(timer.end)}</span></p>
      </div>
    </div>
  );
}
