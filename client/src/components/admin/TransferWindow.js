import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Switch, message } from 'antd';

const TransferWindow = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [windowName, setWindowName] = useState('');
  const [closingDate, setClosingDate] = useState('');

  const handleSave = async () => {
    const data = {
      windowName,
      closingDate,
      isEnabled
    };

    try {
      const response = await axios.post('/admin/transfer-window', data);
      message.success('Transfer window details saved successfully.');
      console.log('Response:', response.data);
    } catch (error) {
      message.error('Failed to save transfer window details.');
      console.error('Error:', error);
    }
  };

  const handleTerminate = () => {
    setWindowName('');
    setClosingDate('');
    setIsEnabled(false);
    message.warning('Transfer window terminated.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <div className="p-6 border border-gray-300 rounded-xl w-96 shadow-lg bg-white">
        <h2 className="text-lg mb-4 font-semibold text-gray-700">
          {isEnabled ? 'Currently ongoing transfer window' : 'No transfer window ongoing'}
        </h2>
      </div>

      <div className="p-6 border border-gray-300 rounded-xl w-96 shadow-lg bg-white">
        <h2 className="text-lg mb-4 font-semibold text-gray-700">Transfer Management Window</h2>

        <div className="mb-4 flex items-center">
          <p className="mr-4 text-sm text-gray-700">Enable transfer window</p>
          <Switch 
            checked={isEnabled} 
            onChange={(checked) => {
              setIsEnabled(checked);
              if (!checked) {
                setWindowName('');
                setClosingDate('');
              }
            }} 
          />
        </div>

        {isEnabled && (
          <>
            <div className="mb-4">
              <p className="text-sm">Terminate Transfer Window</p>
              <Button 
                type="primary" 
                danger
                onClick={handleTerminate} 
                className="mt-2 w-full" 
              >
                TERMINATE
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Transfer window name:</p>
              <Input 
                placeholder="2025/2026"
                value={windowName}
                onChange={(e) => setWindowName(e.target.value)}
                className="rounded-md"
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Application closing date:</p>
              <Input 
                type="date"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="rounded-md"
              />
            </div>

            <Button 
              onClick={handleSave} 
              type="primary" 
              className="w-full text-white bg-blue-600 hover:bg-blue-700"
            >
              SAVE
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default TransferWindow;
