'use client'

import Link from 'next/link'
import { Layout } from '@/components/Layout'

export default function MiniEntryPage() {
  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">Nexus</h1>
        <p className="text-xs text-slate-300">
          World Verified なユーザー同士で、保証金つきの安心カーシェアを行うためのミニアプリです。
        </p>
      </section>

      <section className="space-y-3">
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400">まずは使い方を選んでください</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/host"
            className="block rounded-xl bg-cyan-500 text-slate-950 px-4 py-4 text-sm font-semibold text-center active:scale-[0.99] transition-transform"
          >
            車を貸したい（ホストとして使う）
          </Link>

          <div className="rounded-xl border border-slate-800 px-4 py-3 space-y-2">
            <p className="text-sm font-medium">車を借りる（借り手として使う）</p>
            <p className="text-[11px] text-slate-400">
              ホストから渡されたリンク
              <span className="text-slate-200">（/tx?...）</span>
              をタップすると、保証金ロック画面が開きます。
            </p>
            <p className="text-[11px] text-slate-500">
              この画面から直接借り手モードには入りません。ホストから送られたURL経由でアクセスしてください。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 space-y-2">
        <h2 className="text-xs font-semibold">このアプリについて</h2>
        <p className="text-[11px] text-slate-300">
          Nexus は、カーシェアなどの個人間取引で発生する
          <span className="font-semibold">「もしもの時のための保証金」</span>
          を、一時的にロックしておくためのレイヤーです。
        </p>
        <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
          <li>ホストが「取引リンク」を作成します。</li>
          <li>借り手はリンクを開いて、保証金をロックします。</li>
          <li>取引が問題なく終了したら、保証金は原則全額返金されます。</li>
        </ul>
        <p className="text-[11px] text-amber-300 mt-1">
          現在のバージョンはプロトタイプであり、表示される保証金ロックはデモ動作です。
          実際の送金・ロックは行われません。将来のバージョンで USDC によるロックに対応予定です。
        </p>
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
        <p className="text-[10px] text-slate-500">© {new Date().getFullYear()} Nexus</p>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <Link href="/legal/terms" className="hover:text-slate-200 underline underline-offset-2">
            利用規約
          </Link>
          <Link href="/legal/privacy" className="hover:text-slate-200 underline underline-offset-2">
            プライバシーポリシー
          </Link>
        </div>
      </footer>
    </Layout>
  )
}
