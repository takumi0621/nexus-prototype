'use client'

import { useEffect, type ReactNode } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

type MiniKitProviderProps = {
  children: ReactNode
}

/**
 * World Mini App 用のMiniKit初期化コンポーネント
 * - マウント時に MiniKit.install() を一回だけ呼ぶ
 * - 将来ここに env 判定や共通ロジックを足していく
 */
export function MiniKitProvider({ children }: MiniKitProviderProps) {
  useEffect(() => {
    // World App / 通常ブラウザのどちらでも安全に呼べる
    MiniKit.install()

    // 開発用ログ（本番では消してOK）
    try {
      // World App 内で開いたとき true になる想定
      // ブラウザ直アクセス時は false
      // ※ isInstalled が使えることは公式記事で紹介されている
      //   （将来仕様が変わったらここを差し替え）
      // eslint-disable-next-line no-console
      console.log('MiniKit installed?', MiniKit.isInstalled?.())
    } catch (e) {
      console.warn('MiniKit check failed (dev only log):', e)
    }
  }, [])

  return <>{children}</>
}
