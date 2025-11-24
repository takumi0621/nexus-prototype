'use client'

import Link from 'next/link'
import { Layout } from '@/components/Layout'
import { fakeLogin } from '@/lib/fakeAuth'
import { useState } from 'react'

export default function HomePage() {
  const [hostUser] = useState(() => fakeLogin('host'))
  const [renterUser] = useState(() => fakeLogin('renter'))

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-2xl font-semibold mb-2">Nexus プロトタイプ</h1>
          <p className="text-sm text-slate-300">
            人と人のカーシェアを、World Verified な保証金で安全にするレイヤー。
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-800 rounded-lg">
            <h2 className="font-semibold mb-1">ホストとして試す</h2>
            <p className="text-xs text-slate-400 mb-3">
              あなたの車を貸す側として、取引リンクを発行してみる。
            </p>
            <p className="text-xs text-slate-500 mb-2">
              ログイン中: {hostUser.name}（World Verified）
            </p>
            <Link
              href="/host"
              className="inline-flex items-center justify-center text-sm px-3 py-2 rounded-md bg-cyan-500 text-slate-950 font-medium"
            >
              ホスト画面へ
            </Link>
          </div>

          <div className="p-4 border border-slate-800 rounded-lg">
            <h2 className="font-semibold mb-1">借り手として試す</h2>
            <p className="text-xs text-slate-400 mb-3">
              受け取ったリンクから、保証金をロックする体験を確認する。
            </p>
            <p className="text-xs text-slate-500 mb-2">
              ログイン中: {renterUser.name}（World Verified）
            </p>
            <p className="text-xs text-slate-500">
              ※ 実際の利用時は、World App mini app 内でこの画面に相当する UI が動作します。
            </p>
          </div>
        </section>
      </div>
    </Layout>
  )
}
