
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
        action: 'login',
        client_id: localStorage.getItem('client_id'),
        token: sessionStorage.getItem('token'),
        otp: otp.join(''),
        csrfToken: csrfToken,
        callbackUrl: '/dashboard',
      })
      console.log(res);
      
      if(res?.url) router.push(res.url)
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

const SignIn = ({ csrfToken }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [token, setToken] = useState('')

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://uatopenapi.stoxkart.com/auth/login', {
        platform: 'web',
        data: {
          client_id: email,
          password,
        }
      },
        {
          headers: {
            'X-Platform': 'web',
          }
        }
      )
      if (res) {
        sessionStorage.setItem('token', res.data.data.token)
        localStorage.setItem('client_id', email)
        setToken(res.data.data.token)
        // router.push('/login/otp')
      }

    } catch (error) {
      console.log(error);


    }
    // Add your login logic here, like sending a request to your authentication API
  };

  return (
    <>
    {
      !token ?  <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Login
          </button>
        </form>
      </div>
    </div> : <OtpInput csrfToken={csrfToken} length={6} onComplete={() => {}}/>
    }
   
    </>
    
  );
};

export default SignIn;

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}


