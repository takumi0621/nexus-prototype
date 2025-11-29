'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type HostTxState = 'locked' | 'released'

export default function HostTxDemoPage() {
  const [state, setState] = useState<HostTxState>('locked')

  const handleRelease = () => {
    if (state !== 'locked') return
    const ok = window.confirm(
      'この取引の保証金を「解放済み」の状態に変更します。（デモ動作です）'
    )
    if (!ok) return
    setState('released')
  }

  const statusLabel =
    state === 'locked'
      ? '現在、保証金はロック中という想定です。'
      : '保証金は解放済みという想定です。'

  const statusBadge =
    state === 'locked' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-600 text-slate-50'

  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">取引の詳細（ホスト用・デモ）</h1>
        <p className="text-xs text-slate-300">
          実際の USDC ロックではなく、将来の本番フローをイメージするための画面です。
        </p>
      </section>

      <section className="mt-3 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-100">Prius 1日レンタル</p>
            <p className="text-[11px] text-slate-400">
              ホスト: あなた（例） / 借り手: 山田さん
            </p>
            <p className="text-[11px] text-slate-400">利用期間: 2025/12/01 10:00〜20:00</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[11px] text-slate-300 font-semibold">200 USDC</p>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${statusBadge}`}>
              {state === 'locked' ? '保証金 ロック中（デモ）' : '保証金 解放済み（デモ）'}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 mt-2">{statusLabel}</p>
      </section>

      <section className="mt-3 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <h2 className="text-xs font-semibold text-slate-200">ホストとしての操作（デモ）</h2>
        <p className="text-[11px] text-slate-400">
          実際のサービスでは、ここから保証金の「解放」や、トラブル時のステータス変更を行う想定です。
          このバージョンではフロントエンド上の表示だけが変わり、実際の送金・ロックは行われません。
        </p>

        <button
          type="button"
          onClick={handleRelease}
          disabled={state !== 'locked'}
          className="w-full rounded-xl bg-amber-400 px-4 py-3 text-xs font-semibold text-slate-950 text-center active:scale-[0.99] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'locked' ? '取引完了として保証金を解放する（デモ）' : 'すでに解放済みです'}
        </button>

        <p className="text-[10px] text-slate-500 mt-2">
          ※ 将来的には、World App 内の USDC ロック／解放にこの操作が紐づく想定です。
          その際には、利用規約やトラブル対応フローを整えた上で、本番向けに有効化します。
        </p>
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <Link
          href="/host/transactions"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          ← 取引一覧にもどる
        </Link>
        <Link
          href="/mini"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          Nexus ホームへ
        </Link>
      </footer>
    </Layout>
  )
}
