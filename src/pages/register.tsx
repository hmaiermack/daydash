import React from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

type Inputs = {
    email: string
    password: string
}

/* eslint-disable */
const register = () => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })
    const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>({
        resolver: zodResolver(schema),
    })

    const router = useRouter()
    const onSubmit = async (data: Inputs) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        })

        if (response.ok) {
            console.log('success')
            signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
                }).then((res) => {
                    if (res?.ok) {
                        router.push('/')
                    }
                }).catch((err) => {
                    //TODO: tell user account created but failed to sign in
                    // 5sec countdown to sign in redirect
                    router.push('/api/auth/signin')
                })
        } else {
            const json = await response.json()
            json.type === 'EMAIL_EXISTS' && setError('email', {message: json.message})
        }
    }
  return (
    <div className='bg-slate-100 w-screen h-screen flex flex-col justify-center items-center'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
                <legend className='text-center text-2xl font-semibold mb-4'>Create new account</legend>
                <label htmlFor="email" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Email</label>
                <input type="email" className={`appearance-none block bg-white text-gray-900 border font-medium ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400 focus:outline-none'} rounded-lg py-3 px-3 leading-tight`} {...register("email")}/>
                    {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
                <label htmlFor="password" className="block uppercase tracking-wide text-gray-700 text-xs font-bold m-2">Password</label>
                <input type="password" className={`appearance-none block bg-white text-gray-900 border font-medium ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-400 focus:outline-none'} rounded-lg py-3 px-3 leading-tight`} {...register("password")}/>
                    {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
            </fieldset>
            <button type="submit" className='mx-auto p-4 bg-green-400 text-white hover:bg-green-500 rounded-lg mt-4'>Register</button>
        </form>

        <span className='text-sm italic mt-4'>Already have an account? <Link href="/api/auth/signin"><a className='underline text-blue-500'>Sign In</a></Link></span>
    </div>
  )
}

export default register