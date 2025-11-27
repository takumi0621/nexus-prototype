import { redirect } from 'next/navigation'

export default function Page() {
  // ルートに来たら必ず /mini に飛ばす
  redirect('/mini')
}
