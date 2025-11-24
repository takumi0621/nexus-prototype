'use client'

import { Layout } from '@/components/Layout'
import { fakeLogin } from '@/lib/fakeAuth'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type DepositAmount = 3000 | 5000 | 10000

type LocalTransaction = {
  id: string
  carName: string
  from: string
  to: string
  amount: DepositAmount
  status: 'pending' | 'locked' | 'completed'
}

export default function HostPage() {
  const [host] = useState(() => fakeLogin('host'))
  const [carName, setCarName] = useState('プリウス')
  const [from, setFrom] = useState('2025-11-25 10:00')
  const [to, setTo] = useState('2025-11-25 18:00')
  const [amount, setAmount] = useState<DepositAmount>(3000)
  const [transactions, setTransactions] = useState<LocalTransaction[]>([])
  const [lastLink, setLastLink] = useState<string | null>(null)

  useEffect(() => {
    setTransactions([])
  }, [])

  const buildLink = (tx: LocalTransaction) => {
    const params = new URLSearchParams({
      carName: tx.carName,
      from: tx.from,
      to: tx.to,
      amount: String(tx.amount),
    })
    return window.location.origin + '/tx?' + params.toString()
  }

  const handleCreate = () => {
    const tx: LocalTransaction = {
      id: 'tx-' + Math.random().toString(36).slice(2, 8),
      carName,
      from,
      to,
      amount,
      status: 'pending',
    }
    const next = [tx, ...transactions]
    setTransactions(next)

    if (typeof window !== 'undefined') {
      const link = buildLink(tx)
      setLastLink(link)
    }
  }

  const handleCopy = () => {
    if (!lastLink) return
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lastLink).then(
        () => {
          alert('リンクをコピーしました。')
        },
        () => {
          alert('コピーに失敗しました。手動でコピーしてください。')
        },
      )
    } else {
      window.prompt('このリンクをコピーしてください:', lastLink)
    }
  }

  const buildRelativeHref = (tx: LocalTransaction) => {
    const params = new URLSearchParams({
      carName: tx.carName,
      from: tx.from,
      to: tx.to,
      amount: String(tx.amount),
    })
    return '/tx?' + params.toString()
  }

  return (
    <Layout>
      <section className="space-y-1">
        <p className="text-[11px] text-slate-400">ホストモード</p>
        <h1 className="text-lg font-semibold">車を貸すためのリンクを作成</h1>
        <p className="text-[11px] text-slate-400">
          ログイン中: {host.name}（World Verified）
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 space-y-3">
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">車種</label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-400 mb-1">利用時間</label>
            <div className="space-y-1">
              <input
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm mb-1"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="開始（例: 2025-11-25 10:00）"
              />
              <input
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="終了（例: 2025-11-25 18:00）"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">必要な保証金</label>
            <div className="flex gap-2">
              {[3000, 5000, 10000].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v as DepositAmount)}
                  className={
                    'flex-1 px-2 py-2 rounded-xl text-xs border ' +
                    (amount === v
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'border-slate-600 bg-slate-950')
                  }
                >
                  {v.toLocaleString()} 円
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="w-full mt-1 inline-flex items-center justify-center px-3 py-3 rounded-xl bg-cyan-500 text-slate-950 text-sm font-semibold active:scale-[0.99] transition-transform"
        >
          借り手に渡すリンクを作成
        </button>

        {lastLink && (
          <div className="mt-4 space-y-1">
            <p className="text-[11px] text-slate-400">最新のリンク（借り手に送ってください）</p>
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-[11px]"
                value={lastLink}
                readOnly
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-slate-700 text-[11px] font-medium"
              >
                コピー
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/20 px-4 py-3 space-y-2">
        <h2 className="text-xs font-semibold">このセッションで作成した取引</h2>
        {transactions.length === 0 && (
          <p className="text-[11px] text-slate-500">まだ作成された取引はありません。</p>
        )}
        <ul className="space-y-2 text-[11px]">
          {transactions.map((t) => (
            <li key={t.id} className="border border-slate-800 rounded-xl p-2 flex justify-between items-center">
              <div>
                <div className="font-medium text-xs">
                  {t.carName} / {t.amount.toLocaleString()}円
                </div>
                <div className="text-slate-400">
                  {t.from} → {t.to}
                </div>
                <div className="text-slate-500">ステータス: {t.status}</div>
              </div>
              <Link
                href={buildRelativeHref(t)}
                className="text-cyan-400 underline underline-offset-2 decoration-dotted"
              >
                借り手画面
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
