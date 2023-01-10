import React from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'

const Register = () => {
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const data = Object.fromEntries(formData)
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
                })
        } else {
            const json = await response.json()
            console.log(json)
        }

    }
  return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Register</button>
    </form>
  )
}

export default Register