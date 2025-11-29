'use client'

import Link from 'next/link'
import { Layout } from '@/components/Layout'

export default function TermsPage() {
  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">利用規約（Nexus v1）</h1>
        <p className="text-xs text-slate-300">
          この画面はプロダクトの概要を示すための簡易版です。
          正式運用時には、別途詳細な規約を公開します。
        </p>
      </section>

      <section className="mt-4 space-y-2 text-[11px] text-slate-300">
        <p>
          1. Nexus v1 は、個人間取引における「保証金の合意内容」を記録することを目的としたアプリです。
        </p>
        <p>
          2.
          現時点のバージョンでは、アプリ内での送金・資金ロックは行われません。実際の支払いは、銀行振込や他の手段で、ユーザー同士の責任において行われます。
        </p>
        <p>
          3.
          本アプリに表示される金額や期間などの情報は、ユーザーが入力した内容に基づきます。当社（開発者）は、その正確性や完全性を保証しません。
        </p>
        <p>
          4.
          ユーザーは、取引相手との間で十分にコミュニケーションを行い、自身の判断と責任において取引を行うものとします。
        </p>
        <p>
          5.
          将来、USDC 等のデジタル資産を用いた保証金ロック機能を提供する場合は、別途あらためて規約を改定し、事前に告知します。
        </p>
      </section>

      <footer className="mt-4 pt-3 border-t border-slate-900">
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
