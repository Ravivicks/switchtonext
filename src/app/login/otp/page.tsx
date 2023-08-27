"use client"

import React, { useState, useRef } from 'react';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { signIn, getCsrfToken } from 'next-auth/react';


interface OtpInputProps {
    length: number;
    onComplete: (otp: string) => void;
    csrfToken: any
}

const OtpInput: React.FC<OtpInputProps> = ({ length, onComplete, csrfToken }) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = Array.from({ length }, () => useRef<HTMLInputElement | null>(null));
    const router = useRouter()

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

    const submitOtp = async (e: any) => {
        e.preventDefault()
        const res = await signIn('credentials', {
          redirect: false,
          otp: otp.join(''),
          csrfToken: csrfToken,
          callbackUrl: '/dashboard',
        })
        if(res?.url) router.push(res.url)
        // try {
        //     const res = await axios.post('https://uatopenapi.stoxkart.com/auth/twofa/verify', {
        //         data: {
        //             action: 'login',
        //             client_id: 'RRAVI123',
        //             otp: otp.join(''),
        //             token: '90541dc5939f5c576d8da1e72a46c55ad25ce45f1381c34786075d6cea598dfb'
        //         },
        //         platform: 'web'
        //     },
        //         {
        //             headers: {
        //                 'X-Client-Id': 'RRAVI123',
        //                 'X-Platform': 'web'
        //             }
        //         }

        //     )
        //     if (res) {
        //         router.push('/dashboard')
        //     }
        // } catch (error) {
        //     console.log(error);

        // }
    }

    return (
        <div className="flex justify-center items-center">
            {otp.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    className=" w-10 h-10 mx-1 text-center border rounded focus:ring focus:ring-indigo-200"
                    maxLength={1}
                    value={value}
                    ref={inputRefs[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                />
            ))}
            <br /><br />
            <button type='button' onClick={submitOtp}>Confirm</button>
        </div>
    );
};

export default OtpInput;

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
