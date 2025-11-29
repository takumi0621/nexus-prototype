'use client'

import Link from 'next/link'
import { Layout } from '@/components/Layout'

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">プライバシーポリシー（Nexus v1）</h1>
        <p className="text-xs text-slate-300">
          この画面はプロダクトの概要を示すための簡易版です。
          正式運用時には、別途詳細なポリシーを公開します。
        </p>
      </section>

      <section className="mt-4 space-y-2 text-[11px] text-slate-300">
        <p>
          1.
          Nexus v1 は、ホスト名・車両名・保証金の金額・利用期間などの「取引に関するメモ情報」を扱います。
        </p>
        <p>
          2.
          現時点のバージョンでは、これらの情報はユーザーの端末内（ブラウザのローカルストレージ）に保存されます。
          サーバー側での永続保存は行っていません。
        </p>
        <p>
          3.
          将来、サーバーやブロックチェーン上で情報を保存する場合は、保存される項目・目的・保管期間などをあらためて明示します。
        </p>
        <p>
          4.
          ユーザーは、自身の端末のセキュリティ（画面ロックや OS のアップデート等）を適切に管理する責任を負います。
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
