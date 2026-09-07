import { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`)
        }
        return response.json()
      })
      .then((data) => setHealth(data))
      .catch((requestError) => setError(requestError.message))
  }, [])

  return (
    <main>
      <h1>Test de connexion</h1>
      {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
      {error && <p>Erreur : {error}</p>}
      {!health && !error && <p>Chargement...</p>}
    </main>
  )
}

export default App