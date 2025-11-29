'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type TxStatus = 'open' | 'agreed' | 'released' | 'cancelled'
type TxRating = 'good' | 'normal' | 'bad'

type StoredTx = {
  id: string
  host: string
  car: string
  deposit: string
  start?: string
  end?: string
  createdAt: string
  status: TxStatus
  rating?: TxRating
}

const STORAGE_KEY = 'nexus_transactions_v1'

function formatStatus(status: TxStatus) {
  switch (status) {
    case 'open':
      return '進行中（保証金有効の想定）'
    case 'agreed':
      return '借り手の支払い・合意を確認済み'
    case 'released':
      return '取引完了・保証金解放'
    case 'cancelled':
      return 'キャンセル'
    default:
      return status
  }
}

function formatRating(rating?: TxRating) {
  if (!rating) return '未評価'
  switch (rating) {
    case 'good':
      return '良い'
    case 'normal':
      return 'ふつう'
    case 'bad':
      return '悪い'
    default:
      return rating
  }
}

export default function HostTransactionsPage() {
  const [txs, setTxs] = useState<StoredTx[]>([])
  const [ratingTargetId, setRatingTargetId] = useState<string | null>(null)
  const [ratingChoice, setRatingChoice] = useState<TxRating | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const list = JSON.parse(raw) as any[]
      const normalized: StoredTx[] = list.map((tx, idx) => ({
        id: tx.id || String(idx),
        host: tx.host || 'ホスト',
        car: tx.car || '車両',
        deposit: tx.deposit || '—',
        start: tx.start,
        end: tx.end,
        createdAt: tx.createdAt || new Date().toISOString(),
        // 旧データとの互換性のためマッピング
        status:
          tx.status === 'released' || tx.status === 'cancelled'
            ? (tx.status as TxStatus)
            : (tx.status as TxStatus) || 'open',
        rating: tx.rating as TxRating | undefined,
      }))
      normalized.sort((a, b) =>
        (b.createdAt || '').localeCompare(a.createdAt || ''),
      )
      setTxs(normalized)
    } catch {
      // ローカル記録の読み込みに失敗しても致命的ではない
    }
  }, [])

  const saveTxs = (next: StoredTx[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  }

  const updateStatus = (id: string, status: TxStatus) => {
    setTxs(prev => {
      const next = prev.map(tx =>
        tx.id === id ? { ...tx, status } : tx,
      )
      saveTxs(next)
      return next
    })
  }

  const completeWithRating = (id: string, rating: TxRating) => {
    setTxs(prev => {
      const next = prev.map(tx =>
        tx.id === id ? { ...tx, status: 'released', rating } : tx,
      )
      saveTxs(next)
      return next
    })
    setRatingTargetId(null)
    setRatingChoice(null)
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
        <p className="text-[10px] text-slate-500">
          借り手からの入金や合意をチャット等で確認したあと、ステータスを更新してください。
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

        {txs.map(tx => {
          const isRatingOpen = ratingTargetId === tx.id

          return (
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
                  {tx.status === 'released' && (
                    <p className="text-[10px] text-slate-400">
                      評価: {formatRating(tx.rating)}
                    </p>
                  )}
                </div>
              </div>

              {/* アクションボタン群 */}
              <div className="flex flex-col gap-2 items-end">
                {tx.status === 'open' && (
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => updateStatus(tx.id, 'agreed')}
                      className="rounded-lg border border-emerald-500/60 px-3 py-1.5 text-[11px] text-emerald-300 active:scale-[0.98] transition-transform"
                    >
                      借り手の支払い・合意を確認した
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            'この取引をキャンセルとしてマークしますか？元に戻すことはできません。',
                          )
                        ) {
                          updateStatus(tx.id, 'cancelled')
                        }
                      }}
                      className="rounded-lg border border-slate-600 px-3 py-1.5 text-[11px] text-slate-300 active:scale-[0.98] transition-transform"
                    >
                      キャンセルとしてマーク
                    </button>
                  </div>
                )}

                {tx.status === 'agreed' && (
                  <div className="w-full space-y-2">
                    {!isRatingOpen && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setRatingTargetId(tx.id)
                            setRatingChoice(null)
                          }}
                          className="rounded-lg border border-emerald-500/60 px-3 py-1.5 text-[11px] text-emerald-300 active:scale-[0.98] transition-transform"
                        >
                          取引完了して評価をつける
                        </button>
                      </div>
                    )}

                    {isRatingOpen && (
                      <div className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 space-y-2">
                        <p className="text-[11px] text-slate-300">
                          この取引を完了し、借り手を評価してください。
                          一度完了すると元に戻せません。
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setRatingChoice('good')}
                            className={`rounded-lg border px-3 py-1.5 text-[11px] ${
                              ratingChoice === 'good'
                                ? 'border-emerald-400 text-emerald-300'
                                : 'border-slate-600 text-slate-200'
                            }`}
                          >
                            良い
                          </button>
                          <button
                            type="button"
                            onClick={() => setRatingChoice('normal')}
                            className={`rounded-lg border px-3 py-1.5 text-[11px] ${
                              ratingChoice === 'normal'
                                ? 'border-emerald-400 text-emerald-300'
                                : 'border-slate-600 text-slate-200'
                            }`}
                          >
                            ふつう
                          </button>
                          <button
                            type="button"
                            onClick={() => setRatingChoice('bad')}
                            className={`rounded-lg border px-3 py-1.5 text-[11px] ${
                              ratingChoice === 'bad'
                                ? 'border-rose-400 text-rose-300'
                                : 'border-slate-600 text-slate-200'
                            }`}
                          >
                            悪い
                          </button>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setRatingTargetId(null)
                              setRatingChoice(null)
                            }}
                            className="rounded-lg border border-slate-600 px-3 py-1.5 text-[11px] text-slate-300 active:scale-[0.98] transition-transform"
                          >
                            キャンセル
                          </button>
                          <button
                            type="button"
                            disabled={!ratingChoice}
                            onClick={() => {
                              if (!ratingChoice) return
                              if (
                                window.confirm(
                                  'この取引を完了としてマークし、評価を保存します。元に戻せません。よろしいですか？',
                                )
                              ) {
                                completeWithRating(tx.id, ratingChoice)
                              }
                            }}
                            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold active:scale-[0.98] transition-transform ${
                              ratingChoice
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            評価を保存して取引完了にする
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(tx.status === 'released' || tx.status === 'cancelled') && (
                  <p className="text-[10px] text-slate-500 text-right">
                    この取引は完了またはキャンセル済みです（ステータスは変更できません）。
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </section>

      <section className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
        <h2 className="text-xs font-semibold text-slate-200">将来の拡張イメージ</h2>
        <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
          <li>本番では、USDC 等のロック情報と連携してステータスを自動更新。</li>
          <li>ロック中 / 解放済み / キャンセルなどの状態をホストと借り手で共有。</li>
          <li>トラブル時のメモやチャット履歴との連携などを追加予定です。</li>
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
