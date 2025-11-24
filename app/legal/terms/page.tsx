import { Layout } from '@/components/Layout'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <Layout>
      <section className="space-y-3">
        <h1 className="text-lg font-semibold">Nexus 利用規約（ベータ版）</h1>
        <p className="text-[11px] text-slate-400">
          この利用規約は、Nexus ミニアプリ（以下「本サービス」）のベータ版に適用される簡易版です。
          将来の正式版リリースに伴い内容が変更される場合があります。
        </p>

        <div className="space-y-2 text-[11px] text-slate-300">
          <section>
            <h2 className="font-semibold text-xs mb-1">1. サービスの性質</h2>
            <p>
              本サービスは、個人間カーシェア等の取引において利用者が設定した保証金を一時的にロックする仕組みを
              提供することを目的とした実験的プロトタイプです。現時点では実際の資金の移動やロックは行われません。
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xs mb-1">2. 金融サービスではないこと</h2>
            <p>
              本サービスは貸金業、銀行業、資金移動業その他の金融サービスを提供するものではありません。
              将来、暗号資産やUSDC等を利用した保証金ロック機能を提供する場合であっても、別途明示された範囲内での利用となります。
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xs mb-1">3. 免責事項</h2>
            <p>
              本サービスは現時点ではベータ版であり、「現状有姿」で提供されます。開発者は、本サービスの利用に関連して発生した
              損害について、一切の責任を負わないものとします。実際の取引条件やトラブル対応は、ホストおよび借り手の間で合意された内容に従ってください。
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xs mb-1">4. 規約の変更</h2>
            <p>
              本サービスの改善や法令対応のため、予告なく本規約を変更する場合があります。重要な変更がある場合は、本サービス内でお知らせいたします。
            </p>
          </section>
        </div>

        <p className="text-[10px] text-slate-500">
          ベータ版に関するお問い合わせやフィードバックは、開発者まで直接ご連絡ください。
        </p>

        <Link href="/mini" className="inline-block text-[11px] text-cyan-400 underline underline-offset-2">
          ← Nexus ミニアプリに戻る
        </Link>
      </section>
    </Layout>
  )
}
