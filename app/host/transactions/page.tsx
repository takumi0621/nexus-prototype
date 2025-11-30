'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type Tx = {
  id: string
  host_client_id: string | null
  host_name: string | null
  car_name: string | null
  deposit: number
  start_date: string | null
  end_date: string | null
  status: string | null
  rating: string | null
  created_at: string
}

type UiStatus = 'idle' | 'loading'

export default function HostTransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rowState, setRowState] = useState<Record<string, UiStatus>>({})

  // 一覧読み込み
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/nexus/transactions', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || !json.ok) {
          throw new Error(json.error || '読み込みに失敗しました')
        }
        setTxs(json.transactions || [])
      } catch (e: any) {
        setError(e?.message ?? '読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const setRowLoading = (id: string, isLoading: boolean) => {
    setRowState(prev => ({ ...prev, [id]: isLoading ? 'loading' : 'idle' }))
  }

  const applyUpdateToLocal = (updated: Tx) => {
    setTxs(prev => prev.map(tx => (tx.id === updated.id ? updated : tx)))
  }

  // 取引完了 + 評価
  const handleCompleteWithRating = async (tx: Tx) => {
    if (tx.status && tx.status !== 'locked') {
      alert('この取引はすでに完了またはキャンセルされています。')
      return
    }

    const ok = window.confirm(
      'この取引を「完了」として記録します。保証金は解放された前提になります。\nこの操作は基本的に元に戻せません。続行しますか？',
    )
    if (!ok) return

    const ratingInput = window.prompt(
      '借り手の評価を 1〜5 で入力してください（例: 5 = とても良い、1 = 良くなかった）。\n未入力のまま OK を押すと評価なしで記録されます。',
    )

    let rating: string | null = null
    if (ratingInput && ratingInput.trim() !== '') {
      const num = Number(ratingInput.trim())
      if (!Number.isNaN(num) && num >= 1 && num <= 5) {
        rating = String(num)
      } else {
        alert('1〜5 の数値ではないため、今回は評価なしとして記録します。')
      }
    }

    try {
      setRowLoading(tx.id, true)
      const res = await fetch(`/api/nexus/transactions/${tx.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'released', rating }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || '更新に失敗しました')
      }
      applyUpdateToLocal(json.transaction as Tx)
    } catch (e: any) {
      alert(`完了処理に失敗しました: ${e?.message ?? '不明なエラー'}`)
    } finally {
      setRowLoading(tx.id, false)
    }
  }

  // キャンセル
  const handleCancel = async (tx: Tx) => {
    if (tx.status && tx.status !== 'locked') {
      alert('この取引はすでに完了またはキャンセルされています。')
      return
    }

    const ok = window.confirm(
      'この取引を「キャンセル」として記録します。\n本当にキャンセル済みであることを確認してください。',
    )
    if (!ok) return

    try {
      setRowLoading(tx.id, true)
      const res = await fetch(`/api/nexus/transactions/${tx.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', rating: null }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || '更新に失敗しました')
      }
      applyUpdateToLocal(json.transaction as Tx)
    } catch (e: any) {
      alert(`キャンセル処理に失敗しました: ${e?.message ?? '不明なエラー'}`)
    } finally {
      setRowLoading(tx.id, false)
    }
  }

  const renderStatusBadge = (tx: Tx) => {
    const s = tx.status ?? 'locked'
    if (s === 'released') {
      return (
        <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/40">
          完了（解放済）
        </span>
      )
    }
    if (s === 'cancelled') {
      return (
        <span className="text-[11px] px-2 py-1 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/40">
          キャンセル
        </span>
      )
    }
    return (
      <span className="text-[11px] px-2 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40">
        ロック済（進行中）
      </span>
    )
  }

  const renderRating = (tx: Tx) => {
    if (!tx.rating) return null
    const num = Number(tx.rating)
    let label = `評価: ${tx.rating}`
    if (!Number.isNaN(num)) {
      if (num >= 5) label = '評価: ⭐️⭐️⭐️⭐️⭐️ とても良い'
      else if (num === 4) label = '評価: ⭐️⭐️⭐️⭐️ 良い'
      else if (num === 3) label = '評価: ⭐️⭐️⭐️ ふつう'
      else if (num === 2) label = '評価: ⭐️⭐️ あまり良くない'
      else if (num <= 1) label = '評価: ⭐️ 良くなかった'
    }
    return (
      <p className="text-[11px] text-slate-300 mt-1">
        {label}
      </p>
    )
  }

  return (
    <Layout>
      {/* 上部ナビ */}
      <header className="mb-3 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">取引一覧（ホスト用）</h1>
          <p className="text-xs text-slate-300">
            借り手が保証金ロックに同意した取引の記録を表示します。
            完了・キャンセルした取引はここからステータスを更新してください。
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Link
            href="/host"
            className="text-[11px] text-cyan-300 underline underline-offset-2"
          >
            ← 取引リンク作成に戻る
          </Link>
          <Link
            href="/"
            className="text-[10px] text-slate-400 underline underline-offset-2"
          >
            Nexus ホーム
          </Link>
        </div>
      </header>

      {loading && (
        <p className="mt-4 text-xs text-slate-400">読み込み中...</p>
      )}

      {error && (
        <p className="mt-4 text-xs text-rose-400">エラー: {error}</p>
      )}

      {!loading && !error && txs.length === 0 && (
        <p className="mt-4 text-xs text-slate-400">
          まだ記録された取引がありません。
          「取引リンク作成」画面からリンクを作成し、借り手に開いてもらってください。
        </p>
      )}

      <div className="mt-4 space-y-3">
        {txs.map(tx => {
          const statusKey = tx.status ?? 'locked'
          const isLocked = statusKey === 'locked'
          const isWorking = rowState[tx.id] === 'loading'

          return (
            <article
              key={tx.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-100">
                    {tx.car_name ?? '（車名未設定）'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ホスト: {tx.host_name ?? 'ホスト'}
                  </p>
                </div>
                {renderStatusBadge(tx)}
              </div>

              <dl className="text-[11px] text-slate-300 space-y-1 mt-1">
                <div className="flex justify-between">
                  <dt className="text-slate-400">保証金</dt>
                  <dd>{tx.deposit} （USDC 想定）</dd>
                </div>
                {tx.start_date && (
                  <div className="flex justify-between">
                    <dt className="text-slate-400">利用開始日</dt>
                    <dd>{tx.start_date}</dd>
                  </div>
                )}
                {tx.end_date && (
                  <div className="flex justify-between">
                    <dt className="text-slate-400">利用終了日</dt>
                    <dd>{tx.end_date}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-400">作成日時</dt>
                  <dd>{new Date(tx.created_at).toLocaleString()}</dd>
                </div>
              </dl>

              {renderRating(tx)}

              {/* アクションボタン */}
              <div className="mt-3 flex flex-col gap-2">
                {isLocked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCompleteWithRating(tx)}
                      disabled={isWorking}
                      className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-[11px] font-semibold text-slate-950 text-center active:scale-[0.99] transition-transform disabled:opacity-60"
                    >
                      {isWorking ? '更新中...' : '取引完了として記録（保証金解放）'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(tx)}
                      disabled={isWorking}
                      className="w-full rounded-lg border border-slate-700 px-3 py-2 text-[11px] text-slate-200 text-center active:scale-[0.99] transition-transform disabled:opacity-60"
                    >
                      {isWorking ? '処理中...' : 'この取引をキャンセルとして記録'}
                    </button>
                    <p className="text-[10px] text-slate-500">
                      ※ Nexus はあくまで合意内容の記録レイヤーです。
                      実際の送金や返金は、現在はアプリ外で行われている前提です。
                    </p>
                  </>
                ) : (
                  <p className="text-[10px] text-slate-500">
                    この取引はすでに
                    {statusKey === 'released' ? '完了（解放済）' : 'キャンセル'}
                    として記録されています。
                  </p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </Layout>
  )
}
