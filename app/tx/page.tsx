'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/Layout'

type SubmitState = 'idle' | 'submitting' | 'done' | 'error'

function TxPageInner() {
  const searchParams = useSearchParams()

  const hostName = searchParams.get('host') || 'ホスト'
  const carName = searchParams.get('car') || ''
  const depositStr = searchParams.get('deposit') || ''
  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''

  const deposit = depositStr ? Number(depositStr) : NaN

  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [txId, setTxId] = useState<string | null>(null)

  const handleAgree = async () => {
    setError(null)

    if (!carName || !depositStr || Number.isNaN(deposit)) {
      alert('リンクの情報が不完全です。ホストに再度リンクを発行してもらってください。')
      return
    }

    const ok = window.confirm(
      `「${carName}」の利用にあたって、保証金 ${deposit}（USDC 想定）のロックに同意しますか？\n\n現在はデモ版のため、実際の送金・ロックは行われず、合意内容のみ記録されます。`,
    )
    if (!ok) return

    try {
      setState('submitting')

      const res = await fetch('/api/nexus/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName,
          carName,
          deposit,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.ok) {
        throw new Error(json.error || '記録に失敗しました')
      }

      setTxId(json.transaction?.id ?? null)
      setState('done')
    } catch (e: any) {
      setError(e?.message ?? '記録に失敗しました')
      setState('error')
    }
  }

  const invalidLink = !carName || !depositStr || Number.isNaN(deposit)

  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">保証金ロックへの同意</h1>
        <p className="text-xs text-slate-300">
          この画面は、ホストから共有されたリンクにもとづいて、
          カーシェアなどの取引における「保証金ロックへの同意」を記録します。
        </p>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
        <h2 className="text-xs font-semibold text-slate-200">取引内容</h2>

        {invalidLink ? (
          <p className="text-[11px] text-rose-300">
            リンクの情報が不足しているか、不正です。
            一度ホストに確認し、取引リンクを再発行してもらってください。
          </p>
        ) : (
          <dl className="text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between">
              <dt className="text-slate-400">ホスト</dt>
              <dd>{hostName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">車</dt>
              <dd>{carName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">保証金</dt>
              <dd>{deposit}（USDC 想定）</dd>
            </div>
            {startDate && (
              <div className="flex justify-between">
                <dt className="text-slate-400">利用開始日</dt>
                <dd>{startDate}</dd>
              </div>
            )}
            {endDate && (
              <div className="flex justify-between">
                <dt className="text-slate-400">利用終了日</dt>
                <dd>{endDate}</dd>
              </div>
            )}
          </dl>
        )}

        <p className="mt-2 text-[10px] text-amber-300">
          現在のバージョンでは、World App 上のウォレット残高を動かすことはありません。
          あくまで「どの条件で保証金ロックに同意したか」を Nexus のバックエンド（Supabase）に記録するだけです。
        </p>
      </section>

      <section className="mt-4 space-y-3">
        {state === 'done' ? (
          <div className="rounded-2xl border border-emerald-600/40 bg-emerald-900/20 p-4 space-y-2">
            <p className="text-sm font-semibold text-emerald-200">
              保証金ロックへの同意を記録しました。
            </p>
            {txId && (
              <p className="text-[11px] text-emerald-200">
                取引ID: <span className="font-mono">{txId}</span>
              </p>
            )}
            <p className="text-[11px] text-emerald-100">
              取引が完了すると、ホスト側の画面から「完了」または「キャンセル」としてステータスが更新されます。
            </p>
            <Link
              href="/"
              className="inline-flex mt-2 rounded-lg border border-emerald-500/60 px-3 py-2 text-[11px] text-emerald-100 active:scale-[0.99] transition-transform"
            >
              Nexus ホームに戻る
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={invalidLink || state === 'submitting'}
              onClick={handleAgree}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 text-center active:scale-[0.99] transition-transform disabled:opacity-60"
            >
              {state === 'submitting'
                ? '記録中...'
                : 'この内容で保証金ロックに同意して記録する'}
            </button>

            {error && (
              <p className="text-[11px] text-rose-300">
                エラー: {error}
              </p>
            )}
          </>
        )}
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <p className="text-[10px] text-slate-500">
          © {new Date().getFullYear()} Nexus
        </p>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <Link
            href="/legal/terms"
            className="hover:text-slate-200 underline underline-offset-2"
          >
            利用規約
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:text-slate-200 underline underline-offset-2"
          >
            プライバシーポリシー
          </Link>
        </div>
      </footer>
    </Layout>
  )
}

export default function TxPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <p className="mt-4 text-xs text-slate-400">リンク情報を読み込み中...</p>
        </Layout>
      }
    >
      <TxPageInner />
    </Suspense>
  )
}
