'use client'

import React, { useEffect, useState } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

type EnvLabel = 'unknown' | 'browser' | 'world'

function detectEnv(): EnvLabel {
  if (typeof window === 'undefined') return 'unknown'
  try {
    if (MiniKit.isInstalled?.()) {
      return 'world'
    }
  } catch {
    // MiniKit が World App 外で動いていない場合などはここに落ちる
  }
  return 'browser'
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [env, setEnv] = useState<EnvLabel>('unknown')

  useEffect(() => {
    setEnv(detectEnv())
  }, [])

  const envText =
    env === 'world'
      ? '環境: World App 内'
      : env === 'browser'
      ? '環境: ブラウザ（デモ）'
      : '環境: 判定中'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border border-cyan-400 flex items-center justify-center text-xs">
                ✧
              </div>
              <span className="font-semibold tracking-wide text-sm">Nexus</span>
            </div>
            <span className="text-[9px] px-2 py-1 rounded-full border border-slate-700 text-slate-400">
              {envText}
            </span>
          </div>
        </header>
        <main className="flex-1 px-4 py-4 space-y-4 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  )
}
