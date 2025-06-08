// Replace with your deployed contract details
export const NETWORK = "mainnet" // or 'testnet', 'mainnet'
export const PACKAGE_ID = "0x4385512b06d36c290fcb02b09343209bf0ad9e530ab2e42be6868b1531c11fbf" // Your deployed package ID
export const REGISTRY_ID = "0x7f6d9dcea46d3cac9199331507cae9bb86461612b7ff2007087fb2f1ca6ee0c0" // Your registry object ID

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
