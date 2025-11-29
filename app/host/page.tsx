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

    const params = new URLSearchParams({
      host: form.hostName || 'ホスト',
      car: form.carName,
      deposit: form.deposit,
    })

    if (form.startDate) params.set('start', form.startDate)
    if (form.endDate) params.set('end', form.endDate)

    // デモ用フラグ
    params.set('demo', '1')

    const base =
      typeof window === 'undefined' ? '' : window.location.origin

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
          カーシェアのホストとして、借り手に渡す「保証金ロック用リンク」を作成します。
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
            保証金（デモ。実際の送金は行われません）
          </label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-cyan-400"
            placeholder="例: 200 (USDC 想定)"
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
          借り手がリンクを開くと、保証金ロックのデモ画面（/tx）が開きます。
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
    </Layout>
  )
}
