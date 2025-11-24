export type UserRole = 'host' | 'renter'

export type FakeUser = {
  id: string
  name: string
  role: UserRole
  worldVerified: boolean
}

// 本番では World ID をここに差し替える
export function fakeLogin(role: UserRole): FakeUser {
  return {
    id: role === 'host' ? 'host-123' : 'renter-456',
    name: role === 'host' ? 'ホスト太郎' : '借り手花子',
    role,
    worldVerified: true,
  }
}
