'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { fakeLogin } from '@/lib/fakeAuth'
import Link from 'next/link'

type DepositAmount = 3000 | 5000 | 10000

export default function TransactionPage() {
  const searchParams = useSearchParams()
  const carName = searchParams.get('carName') || ''
  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const amountStr = searchParams.get('amount') || ''
  const amountNum = parseInt(amountStr, 10) as DepositAmount

  const [locked, setLocked] = useState(false)
  const [locking, setLocking] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [user] = useState(() => fakeLogin('renter'))

  const valid =
    carName.length > 0 &&
    from.length > 0 &&
    to.length > 0 &&
    (amountNum === 3000 || amountNum === 5000 || amountNum === 10000)

  if (!valid) {
    return (
      <Layout>
        <section className="space-y-2">
          <h1 className="text-lg font-semibold">リンクが無効です</h1>
          <p className="text-[11px] text-slate-400">
            取引情報が不完全か、リンクの有効期限が切れている可能性があります。
          </p>
          <p className="text-[11px] text-slate-400">
            ホストから送られた最新のリンクを、そのまま再度開いてください。
            それでも解決しない場合は、ホストに新しいリンクの発行を依頼してください。
          </p>
          <Link
            href="/mini"
            className="inline-block mt-2 text-[11px] text-cyan-400 underline underline-offset-2"
          >
            ← Nexus のトップに戻る
          </Link>
        </section>
      </Layout>
    )
  }

  const handleLock = () => {
    if (locked || locking) return

    setLocking(true)
    setStatusMessage(
      '保証金ロックのテストを実行中です。将来のバージョンでは、ここでUSDCがスマートコントラクトにロックされます。'
    )

    // v1 ではダミーで少し待ってからロック完了扱いにする
    setTimeout(() => {
      setLocked(true)
      setLocking(false)
      setStatusMessage(
        '保証金をロックしました。（現在はデモモードで、実際の送金やロックは行われません）'
      )
      alert('保証金をロックしました。（プロトタイプのため、実際の送金は行われません）')
    }, 600)
  }

  const statusLabel = locked
    ? '保証金ロック済'
    : locking
    ? '保証金ロック処理中'
    : '保証金待ち'

  const statusDotClass = locked
    ? 'bg-emerald-400'
    : locking
    ? 'bg-amber-300'
    : 'bg-amber-400'

  return (
    <Layout>
      <section className="space-y-1">
        <p className="text-[11px] text-slate-400">借り手モード</p>
        <h1 className="text-lg font-semibold">保証金をロックして予約する</h1>
        <p className="text-[11px] text-slate-400">
          ログイン中: {user.name}（World Verified）
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 space-y-3 text-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[11px] text-slate-400 mb-0.5">車種</div>
            <div className="font-medium">{carName}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400 mb-0.5">ステータス</div>
            <div className="inline-flex items-center gap-1 text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${statusDotClass}`} />
              <span>{statusLabel}</span>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 mb-0.5">利用時間</div>
          <div className="text-xs text-slate-200">
            {from} → {to}
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-400 mb-1">必要な保証金</div>
          <div className="flex gap-2">
            {[3000, 5000, 10000].map((v) => (
              <button
                key={v}
                disabled
                className={
                  'flex-1 px-2 py-2 rounded-xl text-xs border ' +
                  (amountNum === v
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'border-slate-600 bg-slate-950 opacity-60')
                }
              >
                {v.toLocaleString()} 円
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          この保証金は、将来のバージョンでは USDC としてスマートコントラクトにロックされ、取引が問題なく終了した場合は原則全額返金される想定です。
        </p>

        <button
          onClick={handleLock}
          disabled={locked || locking}
          className={
            'w-full mt-1 inline-flex items-center justify-center px-3 py-3 rounded-xl text-sm font-semibold ' +
            (locked
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : locking
              ? 'bg-slate-700 text-slate-200 cursor-wait'
              : 'bg-cyan-500 text-slate-950 active:scale-[0.99] transition-transform')
          }
        >
          {locked
            ? '保証金ロック済み'
            : locking
            ? '保証金をロックしています…'
            : '保証金をロックする（デモ）'}
        </button>

        {statusMessage && (
          <p className="text-[11px] text-slate-400 mt-1">
            {statusMessage}
          </p>
        )}
      </section>
    </Layout>
  )
}
