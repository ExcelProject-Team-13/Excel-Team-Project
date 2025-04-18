import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./index.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex gap-8 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="h-24 transition-transform hover:scale-110 hover:brightness-125"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="h-24 animate-spin-slow-custom transition-transform hover:scale-110 hover:brightness-125"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-4xl font-bold mb-4">Vite + React + Tailwind</h1>

      <div className="p-6 rounded-lg shadow-md text-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
       
      </div>

      <p className="mt-6 text-sm text-gray-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
