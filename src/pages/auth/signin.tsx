import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import FormLabel from '../../components/general/form/FormLabel'
import FormInput from '../../components/general/form/FormInput'

type Inputs = {
    email: string
    password: string
}

/* eslint-disable */
const signin = () => {
    const [err, setErr] = useState<string | undefined>(undefined)
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })
    const { register, handleSubmit, formState: { errors }, setError } = useForm<Inputs>({
        resolver: zodResolver(schema),
    })

    const router = useRouter()
    const onSubmit = async (data: Inputs) => {
        console.log(data)
        setErr(undefined)
        signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
            }).then((res) => {
                console.log(res)
                if (res?.ok) {
                    router.push('/')
                } else {
                    setErr(res?.error)
                    setError('email', {message: ''})
                    setError('password', {message: ''})
                }
            }
        )
    }
  return (
    <div className='bg-slate-100 w-screen h-screen flex flex-col justify-center items-center'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
                <legend className='text-center text-2xl font-semibold mb-4'>Sign In</legend>
                {err && <p className='text-red-500 text-xs italic mb-2'>{err}</p>}
                <FormLabel htmlFor="email" >Email</FormLabel>
                <FormInput register={register} error={errors.email} label='email' type='email'/>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormInput register={register} error={errors.password} label='password' type='password'/>
            </fieldset>
            <button type="submit" className='mx-auto p-4 bg-green-400 text-white hover:bg-green-500 rounded-lg mt-4'>Sign In</button>
        </form>


        <span className='text-sm italic mt-4'>Dont have an account? <Link href="/register"><a className='underline text-blue-500'>Sign Up</a></Link></span>
    </div>
  )
}

export default signin