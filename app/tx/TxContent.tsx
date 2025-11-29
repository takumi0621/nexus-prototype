'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type LockState = 'idle' | 'locking' | 'locked'

export function TxContent() {
  const searchParams = useSearchParams()

  const host = searchParams.get('host') || 'ホスト'
  const car = searchParams.get('car') || '車両'
  const deposit = searchParams.get('deposit') || '0'
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const [state, setState] = useState<LockState>('idle')

  const handleLock = () => {
    if (state !== 'idle') return
    setState('locking')
    setTimeout(() => {
      setState('locked')
    }, 900)
  }

  const stateLabel: Record<LockState, string> = {
    idle: 'まだ保証金はロックされていません。',
    locking: '保証金をロック中…（デモ）',
    locked: '保証金がロックされた状態のデモ表示です。',
  }

  const stateColor: Record<LockState, string> = {
    idle: 'text-slate-300',
    locking: 'text-cyan-300',
    locked: 'text-emerald-300',
  }

  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">保証金ロック（借り手用・デモ）</h1>
        <p className="text-xs text-slate-300">
          {host} さんとのカーシェア取引のために、保証金をロックするデモ画面です。
          このバージョンでは実際の送金・ロックは行われません。
        </p>
      </section>

      <section className="mt-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-xs font-semibold text-slate-200">取引の概要</h2>
        <div className="space-y-2 text-[11px] text-slate-300">
          <p>
            <span className="text-slate-500">ホスト：</span>
            {host}
          </p>
          <p>
            <span className="text-slate-500">車両：</span>
            {car}
          </p>
          <p>
            <span className="text-slate-500">保証金：</span>
            {deposit}（USDC 想定）
          </p>
          {(start || end) && (
            <p>
              <span className="text-slate-500">利用期間：</span>
              {start || '未指定'} 〜 {end || '未指定'}
            </p>
          )}
        </div>
      </section>

      <section className="mt-3 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-xs font-semibold text-slate-200">保証金ロック（デモ動作）</h2>

        <p className={`text-[11px] ${stateColor[state]}`}>
          {stateLabel[state]}
        </p>

        <button
          type="button"
          onClick={handleLock}
          disabled={state !== 'idle'}
          className="mt-2 w-full rounded-xl bg-cyan-500 px-4 py-3 text-xs font-semibold text-slate-950 text-center active:scale-[0.99] transition-transform disabled:opacity-60"
        >
          {state === 'idle' && 'この内容で保証金をロックする（デモ）'}
          {state === 'locking' && 'ロック中…'}
          {state === 'locked' && 'ロック済み（デモ）'}
        </button>

        <p className="text-[10px] text-slate-500 mt-2">
          ※ 実際のサービスでは、保証金の解放はホスト側の画面または
          自動フローで行われます。このバージョンでは、借り手によるロック体験のみを
          デモ表示しています。
        </p>
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <p className="text-[10px] text-slate-500">© {new Date().getFullYear()} Nexus</p>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <Link href="/legal/terms" className="hover:text-slate-200 underline underline-offset-2">
            利用規約
          </Link>
          <Link href="/legal/privacy" className="hover:text-slate-200 underline underline-offset-2">
            プライバシーポリシー
          </Link>
        </div>
      </footer>
    </Layout>
  )
}
