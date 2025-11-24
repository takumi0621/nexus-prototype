export type DepositAmount = 3000 | 5000 | 10000

export type TransactionStatus = 'pending_deposit' | 'locked' | 'completed'

export type Transaction = {
  id: string
  hostId: string
  renterId?: string
  carName: string
  from: string
  to: string
  requiredDeposit: DepositAmount
  status: TransactionStatus
}

// プロト用のインメモリ変数（本番はDB）
let transactions: Transaction[] = []

export function createTransaction(input: Omit<Transaction, 'id' | 'status'>): Transaction {
  const id = 'tx-' + Math.random().toString(36).slice(2, 8)
  const tx: Transaction = {
    id,
    status: 'pending_deposit',
    ...input,
  }
  transactions.push(tx)
  return tx
}

export function listTransactionsByHost(hostId: string): Transaction[] {
  return transactions.filter((t) => t.hostId === hostId)
}

export function getTransaction(id: string): Transaction | undefined {
  return transactions.find((t) => t.id === id)
}

export function lockDeposit(txId: string, renterId: string): Transaction | undefined {
  const tx = transactions.find((t) => t.id === txId)
  if (!tx) return
  tx.status = 'locked'
  tx.renterId = renterId
  return tx
}

export function completeTransaction(txId: string): Transaction | undefined {
  const tx = transactions.find((t) => t.id === txId)
  if (!tx) return
  tx.status = 'completed'
  return tx
}
