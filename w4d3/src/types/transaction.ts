export type TransactionType = 'income' | 'spending'

export type Transaction = {
  id: number
  merchant: string
  category: string
  date: string
  amount: number
  type: TransactionType
  method: string
}
