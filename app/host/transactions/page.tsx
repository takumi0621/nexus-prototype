'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type TxStatus = 'pending' | 'locked' | 'released' | 'cancelled'
type TxRating = 'none' | 'good' | 'normal' | 'bad'

type StoredTx = {
  id: string
  host: string
  car: string
  deposit: string
  start?: string
  end?: string
  status: TxStatus
  rating: TxRating
  createdAt: string
}

const STORAGE_KEY = 'nexus-host-txs-v1'

function loadTxs(): StoredTx[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as Partial<StoredTx>[]

    return parsed.map((tx, index) => {
      const status: TxStatus =
        tx.status === 'locked' ||
        tx.status === 'released' ||
        tx.status === 'cancelled'
          ? tx.status
          : 'pending'

      const rating: TxRating =
        tx.rating === 'good' ||
        tx.rating === 'normal' ||
        tx.rating === 'bad'
          ? tx.rating
          : 'none'

      return {
        id: tx.id ?? `tx-${index}-${Date.now()}`,
        host: tx.host ?? 'ホスト',
        car: tx.car ?? '',
        deposit: tx.deposit ?? '0',
        start: tx.start,
        end: tx.end,
        createdAt: tx.createdAt ?? new Date().toISOString(),
        status,
        rating,
      }
    })
  } catch {
    return []
  }
}

function saveTxs(txs: StoredTx[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(txs))
}

function statusLabel(status: TxStatus) {
  switch (status) {
    case 'pending':
      return 'リンク発行済み'
    case 'locked':
      return '保証金ロック中（デモ）'
    case 'released':
      return '取引完了・保証金解放済み'
    case 'cancelled':
      return 'キャンセル済み'
  }
}

function statusBadgeClass(status: TxStatus) {
  switch (status) {
    case 'pending':
      return 'bg-slate-800 text-slate-200'
    case 'locked':
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
    case 'released':
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
    case 'cancelled':
      return 'bg-slate-800 text-slate-400 line-through'
  }
}

function ratingLabel(rating: TxRating) {
  switch (rating) {
    case 'good':
      return 'とても良かった'
    case 'normal':
      return '問題なく完了'
    case 'bad':
      return 'トラブルがあった'
    case 'none':
    default:
      return '未評価'
  }
}

export default function HostTransactionsPage() {
  const [txs, setTxs] = useState<StoredTx[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    setTxs(loadTxs())
  }, [])

  const toggleDetails = (id: string) => {
    setSelectedId(prev => (prev === id ? null : id))
  }

  const markLocked = (id: string) => {
    setTxs(prev => {
      const next: StoredTx[] = prev.map(tx =>
        tx.id === id
          ? {
              ...tx,
              status: 'locked' as TxStatus,
            }
          : tx,
      )
      saveTxs(next)
      return next
    })
  }

  const completeWithRating = (id: string, rating: TxRating) => {
    const ok = window.confirm(
      '取引を完了して、保証金を解放したことにします。元に戻せません。本当に実行しますか？',
    )
    if (!ok) return

    setTxs(prev => {
      const next: StoredTx[] = prev.map(tx =>
        tx.id === id
          ? {
              ...tx,
              status: 'released' as TxStatus,
              rating,
            }
          : tx,
      )
      saveTxs(next)
      return next
    })

    setSelectedId(null)
  }

  const cancelTx = (id: string) => {
    const ok = window.confirm(
      'この取引をキャンセルとして記録します。実際の送金には影響しません。本当にキャンセルしますか？',
    )
    if (!ok) return

    setTxs(prev => {
      const next: StoredTx[] = prev.map(tx =>
        tx.id === id
          ? {
              ...tx,
              status: 'cancelled' as TxStatus,
            }
          : tx,
      )
      saveTxs(next)
      return next
    })

    setSelectedId(null)
  }

  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">取引一覧（ホスト用メモ）</h1>
        <p className="text-xs text-slate-300">
          ここでは、あなたが作成した取引リンクと、その後のステータスを確認できます。
          <br />
          現在のバージョンでは、あくまで
          <span className="font-semibold text-slate-100">
            「保証金ロックの合意状況をメモするだけ」
          </span>
          であり、実際のお金の送金やロックは行われません。
        </p>

        <Link
          href="/host"
          className="inline-flex items-center text-[11px] text-cyan-300 underline underline-offset-2"
        >
          ← 取引リンクを作成する画面に戻る
        </Link>
      </section>

      <section className="mt-4 space-y-3">
        {txs.length === 0 ? (
          <p className="text-[11px] text-slate-400">
            まだ記録された取引はありません。
            <br />
            「取引リンクを作成」画面からリンクを発行し、借り手に共有すると、この一覧に記録されます。
          </p>
        ) : (
          <ul className="space-y-3">
            {txs.map(tx => {
              const isSelected = tx.id === selectedId
              const created = new Date(tx.createdAt)

              return (
                <li
                  key={tx.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-100">
                        {tx.car || '車両名未入力'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        保証金メモ:{' '}
                        <span className="font-semibold text-slate-100">
                          {tx.deposit || '0'}
                        </span>{' '}
                        （USDC 想定）
                      </p>
                      <p className="text-[10px] text-slate-500">
                        作成日:{' '}
                        {created.toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {(tx.start || tx.end) && (
                        <p className="text-[10px] text-slate-500">
                          予定期間:{' '}
                          {tx.start
                            ? new Date(tx.start).toLocaleDateString('ja-JP')
                            : '未指定'}{' '}
                          〜{' '}
                          {tx.end
                            ? new Date(tx.end).toLocaleDateString('ja-JP')
                            : '未指定'}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] ${statusBadgeClass(
                        tx.status,
                      )}`}
                    >
                      {statusLabel(tx.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <p>評価: {ratingLabel(tx.rating)}</p>
                    {tx.status === 'locked' && (
                      <button
                        type="button"
                        className="text-[10px] text-amber-300 underline underline-offset-2"
                        onClick={() => markLocked(tx.id)}
                      >
                        ロック中として再読込
                      </button>
                    )}
                  </div>

                  {(tx.status === 'pending' || tx.status === 'locked') && (
                    <button
                      type="button"
                      onClick={() => toggleDetails(tx.id)}
                      className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2 text-[11px] text-slate-200 text-left active:scale-[0.99] transition-transform"
                    >
                      {isSelected
                        ? '▼ 取引完了/キャンセルメニューを閉じる'
                        : '▶ 取引を完了・キャンセルする'}
                    </button>
                  )}

                  {isSelected &&
                    (tx.status === 'pending' || tx.status === 'locked') && (
                      <div className="mt-2 space-y-2 rounded-xl bg-slate-950/60 p-3">
                        <p className="text-[11px] text-slate-300">
                          この取引の結果を記録してください。（デモであり、実際のお金には影響しません）
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => completeWithRating(tx.id, 'good')}
                            className="rounded-lg bg-emerald-500/20 px-2 py-2 text-[11px] text-emerald-200 border border-emerald-500/40 active:scale-[0.99] transition-transform"
                          >
                            とても良かった
                          </button>
                          <button
                            type="button"
                            onClick={() => completeWithRating(tx.id, 'normal')}
                            className="rounded-lg bg-slate-700 px-2 py-2 text-[11px] text-slate-50 active:scale-[0.99] transition-transform"
                          >
                            問題なく完了
                          </button>
                          <button
                            type="button"
                            onClick={() => completeWithRating(tx.id, 'bad')}
                            className="rounded-lg bg-rose-500/20 px-2 py-2 text-[11px] text-rose-200 border border-rose-500/40 active:scale-[0.99] transition-transform"
                          >
                            トラブルがあった
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => cancelTx(tx.id)}
                          className="mt-2 w-full rounded-lg border border-slate-700 px-3 py-2 text-[11px] text-slate-300 active:scale-[0.99] transition-transform"
                        >
                          取引をキャンセルとして記録する
                        </button>
                      </div>
                    )}

                  {tx.status === 'released' && (
                    <p className="mt-2 text-[11px] text-emerald-300">
                      この取引は完了済みとして記録されています。
                    </p>
                  )}

                  {tx.status === 'cancelled' && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      この取引はキャンセル済みとして記録されています。
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </Layout>
  )
}
