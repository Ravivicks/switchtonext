import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                otp: {
                    label: "OTP:",
                    type: "text",
                },
                client_id: {

                },
                token: {

                },
                action: {

                }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                const payload = {
                    platform: 'web',
                    data: {
                        action: credentials?.action,
                        client_id: credentials?.client_id,
                        otp: credentials?.otp,
                        token: credentials?.token
                    }

                };
                const res = await fetch("https://uatopenapi.stoxkart.com/auth/twofa/verify", {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'X-Client-Id': 'RRAVI123',
                        'X-Platform': 'web'
                    }
                })
                console.log(payload)
                const user = await res.json()
                console.log(user);


                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
}