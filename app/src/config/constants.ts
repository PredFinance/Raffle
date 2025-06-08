// Replace with your deployed contract details
export const NETWORK = "devnet" // or 'testnet', 'mainnet'
export const PACKAGE_ID = "0x9b25566ed797304640201a8c93525548ed1a30d5e2a98cb87fc25bef25f1bbd2" // Your deployed package ID
export const REGISTRY_ID = "0xbb5a7eb48c365460870003a57ad820e31aef2387be14d27a9e1e64877ba62917" // Your registry object ID

export const RAFFLE_CONFIG = {
  MIN_TICKET_PRICE: 500_000_000, // 0.5 SUI in MIST
  MAX_FEE_PERCENTAGE: 50,
  DEFAULT_DURATION: 24 * 60 * 60 * 1000, // 24 hours in ms
} as const

export const SUI_DECIMALS = 9
export const MIST_PER_SUI = 1_000_000_000

// Helper function to convert SUI to MIST
export const suiToMist = (sui: number): number => sui * MIST_PER_SUI

// Helper function to convert MIST to SUI
export const mistToSui = (mist: number): number => mist / MIST_PER_SUI

// Format SUI amount for display
export const formatSui = (mist: number): string => {
  const sui = mistToSui(mist)
  return sui.toFixed(3)
}
