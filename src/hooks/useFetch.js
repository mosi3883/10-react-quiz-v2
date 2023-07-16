import { useEffect, useState } from 'react';

export function useFetch(url) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  function fetchData() {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      async function getData() {
        const res = await fetch(url, { signal: controller.signal });
        // if (!res.ok) throw new Error('something went wrong');
        const data = await res.json();
        setData(data);
      }

      getData();
    } catch (err) {
      console.log(err);
      console.log(err.name);
      //setError(err.message);
    } finally {
      setIsLoading(false);
    }
    return function () {
      // controller.abort();
    };
  }

  useEffect(fetchData, [url]);

  return { isLoading, error, data, fetchData };
}
