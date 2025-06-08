"use client"

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { useState, useCallback } from "react"
import { PACKAGE_ID, REGISTRY_ID } from "@/config/constants"
import type { RaffleInfo, CreateRaffleParams } from "@/types/raffle"

export const useRaffleContract = () => {
  const client = useSuiClient()
  const currentAccount = useCurrentAccount()
  const [loading, setLoading] = useState(false)

  const createRaffle = useCallback(
    async (params: CreateRaffleParams) => {
      if (!currentAccount) throw new Error("Wallet not connected")

      setLoading(true)
      try {
        const tx = new Transaction()

        tx.moveCall({
          target: `${PACKAGE_ID}::raffle::create_raffle`,
          arguments: [
            tx.object(REGISTRY_ID),
            tx.pure.u64(params.ticketPrice),
            tx.pure.u64(params.durationMs),
            tx.pure.u64(params.feePercentage),
            tx.pure.u64(params.numWinners),
            tx.object("0x6"), // Clock object
          ],
        })

        return tx
      } finally {
        setLoading(false)
      }
    },
    [currentAccount],
  )

  const buyTicket = useCallback(
    async (raffleId: string, suiAmount: number) => {
      if (!currentAccount) throw new Error("Wallet not connected")

      setLoading(true)
      try {
        const tx = new Transaction()

        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(suiAmount)])

        tx.moveCall({
          target: `${PACKAGE_ID}::raffle::buy_ticket`,
          arguments: [tx.object(raffleId), coin],
        })

        return tx
      } finally {
        setLoading(false)
      }
    },
    [currentAccount],
  )

  const endRaffle = useCallback(
    async (raffleId: string) => {
      if (!currentAccount) throw new Error("Wallet not connected")

      setLoading(true)
      try {
        const tx = new Transaction()

        tx.moveCall({
          target: `${PACKAGE_ID}::raffle::end_raffle`,
          arguments: [
            tx.object(raffleId),
            tx.object("0x6"), // Clock object
            tx.object("0x8"), // Random object
          ],
        })

        return tx
      } finally {
        setLoading(false)
      }
    },
    [currentAccount],
  )

  const withdrawAdminFee = useCallback(
    async (raffleId: string) => {
      if (!currentAccount) throw new Error("Wallet not connected")

      setLoading(true)
      try {
        const tx = new Transaction()

        tx.moveCall({
          target: `${PACKAGE_ID}::raffle::withdraw_admin_fee`,
          arguments: [tx.object(raffleId)],
        })

        return tx
      } finally {
        setLoading(false)
      }
    },
    [currentAccount],
  )

  const getRaffleInfo = useCallback(
    async (raffleId: string): Promise<RaffleInfo | null> => {
      try {
        const response = await client.getObject({
          id: raffleId,
          options: { showContent: true },
        })

        if (!response.data?.content || response.data.content.dataType !== "moveObject") {
          return null
        }

        const fields = (response.data.content as any).fields

        return {
          ticketPrice: Number.parseInt(fields.ticket_price),
          endTime: Number.parseInt(fields.end_time),
          feePercentage: Number.parseInt(fields.fee_percentage),
          numWinners: Number.parseInt(fields.num_winners),
          prizePoolValue: Number.parseInt(fields.prize_pool?.fields?.balance || "0"),
          adminFeeValue: Number.parseInt(fields.admin_fee?.fields?.balance || "0"),
          totalTickets: fields.tickets?.length || 0,
          winners: fields.winners || [],
          active: fields.active,
        }
      } catch (error) {
        console.error("Error fetching raffle info:", error)
        return null
      }
    },
    [client],
  )

  const getUserTickets = useCallback(
    async (raffleId: string, userAddress: string): Promise<number[]> => {
      try {
        const response = await client.getObject({
          id: raffleId,
          options: { showContent: true },
        })

        if (!response.data?.content || response.data.content.dataType !== "moveObject") {
          return []
        }

        const fields = (response.data.content as any).fields
        const tickets = fields.tickets || []

        return tickets
          .filter((ticket: any) => ticket.fields.owner === userAddress)
          .map((ticket: any) => Number.parseInt(ticket.fields.ticket_number))
      } catch (error) {
        console.error("Error fetching user tickets:", error)
        return []
      }
    },
    [client],
  )

  const getAllRaffles = useCallback(async () => {
    try {
      const registryResponse = await client.getObject({
        id: REGISTRY_ID,
        options: { showContent: true },
      })

      if (registryResponse.data?.content && registryResponse.data.content.dataType === "moveObject") {
        const fields = (registryResponse.data.content as any).fields
        return fields.raffles || []
      }
      return []
    } catch (error) {
      console.error("Error fetching raffles:", error)
      return []
    }
  }, [client])

  return {
    createRaffle,
    buyTicket,
    endRaffle,
    withdrawAdminFee,
    getRaffleInfo,
    getUserTickets,
    getAllRaffles,
    loading,
  }
}
