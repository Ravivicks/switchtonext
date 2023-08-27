
"use client"
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter()

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
        if(res) {
            router.push('/login/otp')
        }

        } catch (error) {
            console.log(error);
            

        }
        // Add your login logic here, like sending a request to your authentication API
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
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
        </div>
    );
};

export default Login;
