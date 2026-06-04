import React from "react";

export default function Loading() {
  return (
    <div className="flex bg-zinc-950 text-zinc-50 min-h-screen font-sans">
      <aside className="hidden md:flex flex-col h-screen sticky top-0 left-0 bg-zinc-900 border-r border-zinc-800 text-zinc-400 select-none z-30 w-[240px]">
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-zinc-850 animate-pulse" />
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
          </div>
          <div className="w-6 h-6 rounded bg-zinc-800 animate-pulse" />
        </div>
        <nav className="flex-1 py-6 px-3 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center w-full h-11 px-3 rounded-lg bg-zinc-900/40 animate-pulse">
              <div className="w-5 h-5 rounded bg-zinc-800 mr-3" />
              <div className="h-3 w-20 bg-zinc-800 rounded" />
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
              <div className="h-2 w-20 bg-zinc-850 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-7 h-7 rounded bg-zinc-800 animate-pulse" />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-8 pb-24 md:pb-8 relative">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="relative flex flex-col justify-between bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 min-h-[220px] overflow-hidden animate-pulse">
            <div className="space-y-4 max-w-xl">
              <div className="h-4 w-32 bg-zinc-800 rounded" />
              <div className="h-8 w-64 bg-zinc-800 rounded" />
              <div className="h-3 w-80 bg-zinc-800 rounded" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="h-11 w-40 bg-zinc-800 rounded-lg" />
              <div className="h-11 w-40 bg-zinc-800 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-zinc-800 rounded" />
                  <div className="w-6 h-6 rounded bg-zinc-800" />
                </div>
                <div className="h-6 w-12 bg-zinc-800 rounded" />
                <div className="h-2 w-full bg-zinc-950 rounded-full" />
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-zinc-850 animate-pulse" />
                <div className="h-5 w-36 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-12 bg-zinc-900 rounded-md animate-pulse" />
                <div className="h-6 w-12 bg-zinc-900 rounded-md animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 min-h-[190px] flex flex-col justify-between animate-pulse">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-zinc-800" />
                        <div className="h-3 w-16 bg-zinc-800 rounded" />
                      </div>
                      <div className="h-4 w-16 bg-zinc-800 rounded" />
                    </div>
                    <div className="h-5 w-48 bg-zinc-800 rounded" />
                    <div className="h-3 w-32 bg-zinc-800 rounded" />
                  </div>
                  <div className="space-y-2 mt-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-20 bg-zinc-800 rounded" />
                      <div className="h-3 w-10 bg-zinc-800 rounded" />
                    </div>
                    <div className="h-2 bg-zinc-950 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around z-45 px-2 pb-safe">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center flex-1 h-full py-1 animate-pulse">
            <div className="w-5 h-5 rounded bg-zinc-800 mb-1" />
            <div className="h-2 w-8 bg-zinc-800 rounded" />
          </div>
        ))}
      </nav>
    </div>
  );
}
