import { useState } from 'react'

const useFetch = (cb) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const makeCall = async(...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response)
    } catch (error) {
      console.log('🚀 ~ useEffect ~ error:', error)
      setError(error?.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, makeCall }
}

export default useFetch
