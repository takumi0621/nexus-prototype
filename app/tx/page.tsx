import { Suspense } from 'react'
import { TxContent } from './TxContent'

export default function TxPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-xs text-slate-400">
          取引情報を読み込み中です…
        </div>
      }
    >
      <TxContent />
    </Suspense>
  )
}
