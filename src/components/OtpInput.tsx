import React, { useState, useRef } from 'react';

interface OtpInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = Array.from({ length }, () => useRef<HTMLInputElement | null>(null));

  const handleInputChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (index < length - 1 && value !== '') {
      inputRefs[index + 1].current?.focus();
    }

    if (!newOtp.includes('')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  return (
    <div className="flex justify-center items-center">
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          className="w-10 h-10 mx-1 text-center border rounded focus:ring focus:ring-indigo-200"
          maxLength={1}
          value={value}
          ref={inputRefs[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
};

export default OtpInput;
