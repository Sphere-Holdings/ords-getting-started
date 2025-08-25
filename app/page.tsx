'use client'
import { useEffect, useState } from "react";
import React from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'raw' | 'items'>('raw');
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = process.env.NEXT_PUBLIC_ORDS_ENDPOINT;
      const url = `${endpoint}/ords/hr/countries/`;
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
    <div className="min-h-screen flex flex-col">
      <header className="w-full h-[50px] shadow flex items-center justify-between px-8 bg-[#312D2B]">
        <a href="https://www.oracle.com/"><img src="/oracle-logo.svg" alt="Oracle" className="h-5 w-auto" /></a>
        <a href="https://sphereholdings.co/"><img src="/sphere-org.png" alt="Sphere Holdings" className="h-8 w-auto" /></a>
      </header>
      <div className="flex-1 grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <h1>Communicating with Oracle ORDS</h1>
          <div className="flex flex-col gap-2 mb-4  min-w-[650px] max-w-[650px] max-h-[300px] min-h-[300px] bg-gray-100 rounded-lg p-4">
            <div className="flex gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer ${tab === 'raw' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setTab('raw')}
              >
                Raw Response
              </button>
              <button
                className={`px-4 py-2 rounded-lg cursor-pointer ${tab === 'items' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setTab('items')}
              >
                Rendered Response
              </button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && data && (
              <>
                {tab === 'raw' && (
                  <pre className="bg-gray-100 p-4 rounded text-xs max-w-xl overflow-x-auto text-left">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                )}
                {tab === 'items' && (
                  <div className="flex flex-col gap-2 w-full max-w-xl">
                    {Array.isArray(data.items) && data.items.length > 0 ? (
                      data.items.map((item: any, idx: number) => (
                        <div key={idx} className="border rounded p-3 bg-white shadow text-sm">
                          {Object.entries(item).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <span className="font-semibold">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No items found.</div>
                    )}
                  </div>
                )}
              </>
            )}
            <button onClick={refreshData} className="bg-blue-500 text-white p-2 rounded cursor-pointer mt-4">Refresh</button>
          </div>
        </main>
      </div>
    </div>
  );
}
