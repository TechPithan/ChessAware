
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Username submitted: ${username}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Head>
        <title>ChessAware</title>
      </Head>

      <Image src="/chess-aware-logo.png" alt="ChessAware Logo" width={200} height={200} />

      <h1 className="text-2xl mt-4 text-center font-bold">Deep insights, targeted analysis, and personalised learning to elevate your chess awareness.</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center mt-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your Chess.com username"
          className="border rounded px-4 py-2 mb-4 w-64 text-center"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Analyse My Games
        </button>
      </form>
    </div>
  )
}
