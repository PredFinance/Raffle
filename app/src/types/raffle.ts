export interface RaffleInfo {
  ticketPrice: number
  endTime: number
  feePercentage: number
  numWinners: number
  prizePoolValue: number
  adminFeeValue: number
  totalTickets: number
  winners: string[]
  active: boolean
}

export interface Ticket {
  id: string
  raffleId: string
  ticketNumber: number
  owner: string
}

export interface RaffleEvent {
  type: "TicketPurchased" | "RaffleCreated" | "RaffleEnded" | "AdminFeeWithdrawn"
  data: any
  timestamp: number
}

export interface CreateRaffleParams {
  ticketPrice: number
  durationMs: number
  feePercentage: number
  numWinners: number
}
