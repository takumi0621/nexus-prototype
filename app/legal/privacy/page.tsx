import { Layout } from '@/components/Layout'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <Layout>
      <section className="space-y-3">
        <h1 className="text-lg font-semibold">プライバシーポリシー（ベータ版）</h1>
        <p className="text-[11px] text-slate-400">
          このプライバシーポリシーは、Nexus ミニアプリ（以下「本サービス」）のベータ版における、データの取扱い方針を示す簡易版です。
        </p>

        <div className="space-y-2 text-[11px] text-slate-300">
          <section>
            <h2 className="font-semibold text-xs mb-1">1. 取得する情報</h2>
            <p>
              本サービスは、取引ID、車両情報、利用時間、保証金額など、取引に必要な最小限の情報をアプリ内状態として一時的に保持します。
              現時点では、サーバー側データベースへの永続的な保存は行っていません。
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xs mb-1">2. World App / World ID に関する情報</h2>
            <p>
              将来、World App および World ID と連携する場合、本人確認済みであることを示す情報やウォレットアドレス等を利用する可能性があります。
              その場合でも、必要最小限の範囲でのみ利用し、第三者への提供は行いません（法令に基づく場合を除きます）。
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xs mb-1">3. ログ情報</h2>
            <p>
              開発・品質改善のため、エラーや利用状況に関するログを収集する場合があります。
              これらの情報は、個人を特定することを目的として利用されることはありません。
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xs mb-1">4. ポリシーの変更</h2>
            <p>
              本サービスの機能追加や法令対応に伴い、本ポリシーの内容を変更する場合があります。
              重要な変更がある場合は、本サービス内でお知らせいたします。
            </p>
          </section>
        </div>

        <p className="text-[10px] text-slate-500">
          本ポリシーに関するご質問がある場合は、開発者までお問い合わせください。
        </p>

        <Link href="/mini" className="inline-block text-[11px] text-cyan-400 underline underline-offset-2">
          ← Nexus ミニアプリに戻る
        </Link>
      </section>
    </Layout>
  )
}
