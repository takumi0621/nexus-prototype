'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type TxStatus = 'open' | 'released' | 'cancelled'

type StoredTx = {
  id: string
  host: string
  car: string
  deposit: string
  start?: string
  end?: string
  createdAt: string
  status: TxStatus
}

const STORAGE_KEY = 'nexus_transactions_v1'

function formatStatus(status: TxStatus) {
  switch (status) {
    case 'open':
      return '進行中（保証金有効）'
    case 'released':
      return '完了（保証金解放済み）'
    case 'cancelled':
      return 'キャンセル'
    default:
      return status
  }
}

export default function HostTransactionsPage() {
  const [txs, setTxs] = useState<StoredTx[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const list = JSON.parse(raw) as Partial<StoredTx>[]
      const normalized: StoredTx[] = list.map(tx => ({
        id: tx.id || String(Math.random()),
        host: tx.host || 'ホスト',
        car: tx.car || '車両',
        deposit: tx.deposit || '—',
        start: tx.start,
        end: tx.end,
        createdAt: tx.createdAt || new Date().toISOString(),
        status: (tx.status as TxStatus) || 'open',
      }))
      normalized.sort((a, b) =>
        (b.createdAt || '').localeCompare(a.createdAt || ''),
      )
      setTxs(normalized)
    } catch {
      // ローカル記録の読み込みに失敗しても致命的ではない
    }
  }, [])

  const updateStatus = (id: string, status: TxStatus) => {
    setTxs(prev => {
      const next = prev.map(tx =>
        tx.id === id ? { ...tx, status } : tx,
      )
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }
      return next
    })
  }

  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">取引一覧（ホスト用）</h1>
        <p className="text-xs text-slate-300">
          この端末で作成した「保証金の合意内容」が一覧で表示されます。
        </p>
        <p className="text-[11px] text-amber-300">
          v1 の Nexus は、保証金の金額や期間などを記録するためのツールです。
          アプリ内での送金・ロックは行われません。
          実際の支払いは、銀行振込や他の手段で当事者間で行ってください。
        </p>
      </section>

      <section className="mt-3 space-y-2">
        {txs.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
            <p className="text-[11px] text-slate-300">まだ取引がありません。</p>
            <p className="text-[11px] text-slate-500 mt-1">
              「取引リンクを作成」画面から取引を登録すると、ここに表示されます。
            </p>
          </div>
        )}

        {txs.map(tx => (
          <div
            key={tx.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-100">
                  {tx.car || '車両'}
                </p>
                <p className="text-[11px] text-slate-400">
                  ホスト: {tx.host} / 保証金: {tx.deposit}
                </p>
                {(tx.start || tx.end) && (
                  <p className="text-[11px] text-slate-500">
                    利用期間: {tx.start || '未指定'} 〜 {tx.end || '未指定'}
                  </p>
                )}
              </div>
              <div className="text-right space-y-1">
                <p className="text-[11px] font-semibold text-emerald-300">
                  ステータス: {formatStatus(tx.status)}
                </p>
                <p className="text-[10px] text-slate-500">
                  作成日時:{' '}
                  {tx.createdAt
                    ? new Date(tx.createdAt).toLocaleString()
                    : '不明'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {tx.status === 'open' && (
                <>
                  <button
                    type="button"
                    onClick={() => updateStatus(tx.id, 'released')}
                    className="rounded-lg border border-emerald-500/60 px-3 py-1.5 text-[11px] text-emerald-300 active:scale-[0.98] transition-transform"
                  >
                    取引完了・保証金解放としてマーク
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(tx.id, 'cancelled')}
                    className="rounded-lg border border-slate-600 px-3 py-1.5 text-[11px] text-slate-300 active:scale-[0.98] transition-transform"
                  >
                    キャンセルとしてマーク
                  </button>
                </>
              )}
              {tx.status === 'released' && (
                <button
                  type="button"
                  onClick={() => updateStatus(tx.id, 'open')}
                  className="rounded-lg border border-slate-600 px-3 py-1.5 text-[11px] text-slate-300 active:scale-[0.98] transition-transform"
                >
                  ステータスを進行中に戻す
                </button>
              )}
              {tx.status === 'cancelled' && (
                <button
                  type="button"
                  onClick={() => updateStatus(tx.id, 'open')}
                  className="rounded-lg border border-slate-600 px-3 py-1.5 text-[11px] text-slate-300 active:scale-[0.98] transition-transform"
                >
                  ステータスを進行中に戻す
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
        <h2 className="text-xs font-semibold text-slate-200">将来の拡張イメージ</h2>
        <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
          <li>本番では、USDC 等のロック情報と連携してステータスを管理。</li>
          <li>ロック中 / 解放済み / キャンセルなどの状態をホストが一元管理。</li>
          <li>トラブル時のメモややり取りの記録機能などを追加予定です。</li>
        </ul>
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <Link
          href="/host"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          ← 取引リンクを作成する
        </Link>
        <Link
          href="/mini"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          Nexus ホームへ戻る
        </Link>
      </footer>
    </Layout>
  )
}
