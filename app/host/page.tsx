'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type FormState = {
  hostName: string
  carName: string
  deposit: string
  startDate: string
  endDate: string
}

type StoredTx = {
  id: string
  host: string
  car: string
  deposit: string
  start?: string
  end?: string
  createdAt: string
}

const STORAGE_KEY = 'nexus_transactions_v1'

function saveTx(tx: StoredTx) {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const list: StoredTx[] = raw ? JSON.parse(raw) : []
    list.push(tx)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // v1 はローカル記録なので、失敗しても致命的ではない
  }
}

export default function HostPage() {
  const [form, setForm] = useState<FormState>({
    hostName: '',
    carName: '',
    deposit: '',
    startDate: '',
    endDate: '',
  })

  const [link, setLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault()
    setCopied(false)

    if (!form.deposit || !form.carName) {
      alert('車の名前と保証金は入力してください。')
      return
    }

    const host = form.hostName || 'ホスト'
    const car = form.carName
    const deposit = form.deposit

    const params = new URLSearchParams({
      host,
      car,
      deposit,
    })

    if (form.startDate) params.set('start', form.startDate)
    if (form.endDate) params.set('end', form.endDate)

    // v1 では「合意内容の確認画面」としてのみ機能
    params.set('mode', 'record')

    const base =
      typeof window === 'undefined' ? '' : window.location.origin

    const id =
      typeof window !== 'undefined' && 'crypto' in window
        ? (window.crypto as Crypto).randomUUID()
        : String(Date.now())

    // この端末のブラウザに「取引メモ」として保存
    saveTx({
      id,
      host,
      car,
      deposit,
      start: form.startDate || undefined,
      end: form.endDate || undefined,
      createdAt: new Date().toISOString(),
    })

    const url = `${base}/tx?${params.toString()}`
    setLink(url)
  }

  const handleCopy = async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      alert('クリップボードにコピーできませんでした。')
    }
  }

  return (
    <Layout>
      <section className="space-y-3">
        <h1 className="text-xl font-semibold">取引リンクを作成</h1>
        <p className="text-xs text-slate-300">
          カーシェアのホストとして、借り手に渡す「保証金の合意内容を確認するリンク」を作成します。
        </p>
        <p className="text-[11px] text-amber-300">
          v1 の Nexus は、保証金の金額や条件を「記録する」ためのレイヤーです。
          アプリ内での送金・ロックは行われません。実際の支払いは、銀行振込や他の手段で当事者間で行ってください。
        </p>
      </section>

      <form
        onSubmit={handleCreateLink}
        className="mt-4 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4"
      >
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400">ホスト名（任意）</label>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            placeholder="例: たくみ"
            value={form.hostName}
            onChange={handleChange('hostName')}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-slate-400">車の名前</label>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            placeholder="例: Prius / Model 3 など"
            value={form.carName}
            onChange={handleChange('carName')}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-slate-400">
            保証金の金額（アプリ外で支払われる想定）
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            placeholder="例: 200（USDC 相当など）"
            value={form.deposit}
            onChange={handleChange('deposit')}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">利用開始日（任意）</label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-400"
              value={form.startDate}
              onChange={handleChange('startDate')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">利用終了日（任意）</label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-400"
              value={form.endDate}
              onChange={handleChange('endDate')}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 text-center active:scale-[0.99] transition-transform disabled:opacity-60"
        >
          保証金リンクを作成する
        </button>
      </form>

      <section className="mt-4 space-y-3">
        <h2 className="text-xs font-semibold text-slate-200">
          2. 借り手にリンクを送る
        </h2>
        <p className="text-[11px] text-slate-400">
          作成されたリンクを、チャットアプリなどで借り手に送ってください。
          借り手がリンクを開くと、保証金の内容を確認する画面（/tx）が開きます。
        </p>

        {link && (
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] text-slate-400">作成されたリンク</p>
            <div className="rounded-lg bg-slate-950/60 px-3 py-2 text-[11px] break-all text-slate-200">
              {link}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 rounded-lg border border-slate-700 px-3 py-2 text-[11px] text-slate-200 text-center active:scale-[0.99] transition-transform"
              >
                {copied ? 'コピーしました ✅' : 'リンクをコピー'}
              </button>
              <Link
                href={link}
                className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-900 text-center active:scale-[0.99] transition-transform"
              >
                自分で開いてみる
              </Link>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <Link
          href="/mini"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          Nexus ホームへ戻る
        </Link>
        <Link
          href="/host/transactions"
          className="text-[10px] text-slate-400 underline underline-offset-2 hover:text-slate-200"
        >
          取引一覧を見る
        </Link>
      </footer>
    </Layout>
  )
}
