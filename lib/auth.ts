export type UserRole = 'host' | 'renter'

export type NexusUser = {
  id: string
  name: string
  role: UserRole
  worldVerified: boolean
}

// 今は fakeLogin 経由でダミー。
// 後で World App / World ID からの情報に差し替える。
export function getCurrentUser(role: UserRole): NexusUser {
  if (role === 'host') {
    return {
      id: 'host-123',
      name: 'ホスト太郎',
      role: 'host',
      worldVerified: true,
    }
  }
  return {
    id: 'renter-456',
    name: '借り手花子',
    role: 'renter',
    worldVerified: true,
  }
}
