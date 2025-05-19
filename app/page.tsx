'use client'
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = process.env.NEXT_PUBLIC_ORDS_ENDPOINT;
      const url = `${endpoint}/cephisso_system/test/user`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error: status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  const refreshData = () => {
    fetchData();
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Connecting to Oracle ORDS</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {data && (
          <pre className="bg-gray-100 p-4 rounded text-xs max-w-xl overflow-x-auto text-left">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <button onClick={refreshData} className="bg-blue-500 text-white p-2 rounded cursor-pointer">Refresh</button>
      </main>
    </div>
  );
}
