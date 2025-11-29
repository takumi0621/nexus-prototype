'use client'

import Link from 'next/link'
import { Layout } from '@/components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">Nexus</h1>
        <p className="text-xs text-slate-300">
          World Verified なユーザー同士で、
          個人間カーシェアなどの「保証金の合意内容」を記録するためのアプリです。
        </p>
      </section>

      <section className="space-y-3 mt-3">
        <div className="space-y-1">
          <p className="text-[11px] text-slate-400">
            v1 では、保証金の金額や利用期間などを記録し、当事者同士での合意をサポートします。
          </p>
          <p className="text-[11px] text-amber-300">
            アプリ内での送金・ロックは行われません。
            実際の支払いは、銀行振込や他の手段で当事者間で行ってください。
            将来のバージョンで USDC ロックなどへの対応を検討しています。
          </p>
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
              をタップすると、保証金の合意内容確認画面が開きます。
            </p>
            <p className="text-[11px] text-slate-500">
              この画面から直接借り手モードには入りません。ホストから送られた URL 経由でアクセスしてください。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-4 space-y-2">
        <h2 className="text-xs font-semibold">このバージョンについて</h2>
        <p className="text-[11px] text-slate-300">
          このバージョンの Nexus は、保証金の条件を「見える化・記録」することにフォーカスしています。
        </p>
        <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1">
          <li>ホストが保証金の条件を入力し、リンクを作成。</li>
          <li>借り手がリンクを開き、内容を確認・合意。</li>
          <li>ホストは自分の端末で、作成した取引メモを一覧で確認。</li>
        </ul>
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
