'use client'

import Link from 'next/link'
import { Layout } from '@/components/Layout'

type TxStatus = 'pending' | 'locked' | 'released'

type DemoTx = {
  id: string
  title: string
  car: string
  borrower: string
  deposit: string
  status: TxStatus
}

const demoTxs: DemoTx[] = [
  {
    id: 'demo',
    title: 'Prius 1日レンタル',
    car: 'Prius',
    borrower: '山田さん',
    deposit: '200',
    status: 'locked',
  },
  {
    id: 'demo-2',
    title: 'Model 3 半日レンタル',
    car: 'Model 3',
    borrower: '佐藤さん',
    deposit: '300',
    status: 'pending',
  },
]

const statusLabel: Record<TxStatus, string> = {
  pending: '保証金 未ロック',
  locked: '保証金 ロック中',
  released: '保証金 解放済み',
}

const statusColor: Record<TxStatus, string> = {
  pending: 'text-amber-300',
  locked: 'text-emerald-300',
  released: 'text-slate-400',
}

export default function HostTransactionsPage() {
  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">取引一覧（ホスト用・デモ）</h1>
        <p className="text-xs text-slate-300">
          あなたがホストとして作成した取引の一覧サンプルです。
          実際のデータではなく、UI イメージを確認するためのデモです。
        </p>
      </section>

      <section className="mt-3 space-y-2">
        {demoTxs.map(tx => (
          <Link
            key={tx.id}
            href={tx.id === 'demo' ? '/host/transactions/demo' : '#'}
            className={`block rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 ${
              tx.id === 'demo' ? 'active:scale-[0.99] transition-transform' : 'opacity-60'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-100">{tx.title}</p>
                <p className="text-[11px] text-slate-400">
                  車両: {tx.car} / 借り手: {tx.borrower}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-[11px] text-slate-300">{tx.deposit} USDC</p>
                <p className={`text-[10px] font-medium ${statusColor[tx.status]}`}>
                  {statusLabel[tx.status]}
                </p>
              </div>
            </div>
            {tx.id !== 'demo' && (
              <p className="mt-1 text-[10px] text-slate-500">
                ※ この行は UI イメージ用のダミーです（詳細画面はまだありません）。
              </p>
            )}
          </Link>
        ))}
      </section>

      <section className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3">
        <h2 className="text-xs font-semibold text-slate-200">この画面の役割（将来のイメージ）</h2>
        <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
          <li>ホストが、自分の全ての取引のステータスを一覧で確認する。</li>
          <li>ロック中の取引に対して「解放」操作を行う入口になる。</li>
          <li>将来的に、トラブル時のフラグやメモを表示することも想定。</li>
        </ul>
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <Link
          href="/host"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          ← 新しい取引リンクを作成する
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
