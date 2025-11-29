'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

function TxInner() {
  const search = useSearchParams()

  const host = search.get('host') || 'ホスト'
  const car = search.get('car') || '車両'
  const deposit = search.get('deposit') || '—'
  const start = search.get('start') || ''
  const end = search.get('end') || ''
  const mode = search.get('mode') || 'record'

  const [agreed, setAgreed] = useState(false)

  const period =
    start || end
      ? `${start || '未指定'} 〜 ${end || '未指定'}`
      : '未指定'

  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">保証金の内容を確認</h1>
        <p className="text-xs text-slate-300">
          {host} さんとのカーシェア取引に関する保証金の条件です。内容を確認し、
          問題なければ「合意しました」を押してください。
        </p>
        <p className="text-[11px] text-amber-300">
          v1 の Nexus は、保証金の合意内容を記録するためのツールです。
          この画面でお金が動くことはありません。実際の支払いは、銀行振込や他の手段で当事者間で行ってください。
        </p>
      </section>

      <section className="mt-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400">ホスト</p>
          <p className="text-sm text-slate-100">{host}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-slate-400">車両</p>
          <p className="text-sm text-slate-100">{car}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-slate-400">保証金の金額</p>
          <p className="text-sm text-slate-100">{deposit}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] text-slate-400">利用期間</p>
          <p className="text-sm text-slate-100">{period}</p>
        </div>

        <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 space-y-1">
          <p className="text-[11px] text-slate-300 font-semibold">この画面で行われること</p>
          <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
            <li>保証金の金額・期間などの条件を確認します。</li>
            <li>「合意しました」を押すことで、ホストと借り手の間で条件に合意したことを示します。</li>
            <li>実際の支払いは、アプリ外の手段で行ってください。</li>
          </ul>
        </div>
      </section>

      <section className="mt-4 space-y-3">
        <button
          type="button"
          onClick={() => setAgreed(true)}
          className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 text-center active:scale-[0.99] transition-transform"
        >
          {agreed ? '合意を記録しました ✅' : 'この内容で保証金に合意しました'}
        </button>
        {agreed && (
          <p className="text-[11px] text-emerald-300">
            合意いただきありがとうございます。支払い方法やタイミングについては、ホストとチャット等で確認してください。
          </p>
        )}
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <Link
          href="/mini"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          Nexus ホームへ戻る
        </Link>
        <span className="text-[10px] text-slate-500">
          モード: {mode === 'record' ? '記録用 v1' : mode}
        </span>
      </footer>
    </Layout>
  )
}

export default function TxPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <p className="text-xs text-slate-400">読み込み中…</p>
        </Layout>
      }
    >
      <TxInner />
    </Suspense>
  )
}
