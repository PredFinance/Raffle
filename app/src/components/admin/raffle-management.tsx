"use client"

import { useState } from "react"
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { useRaffleContract } from "@/hooks/useRaffleContract"
import { formatSui } from "@/config/constants"
import type { RaffleInfo } from "@/types/raffle"
import { Play, Square, DollarSign, Clock, Users, Trophy, MoreVertical } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import styles from "./raffle-management.module.css"

interface RaffleManagementProps {
  raffles: Array<{ id: string; info: RaffleInfo }>
  onUpdate: () => void
  loading: boolean
}

export function RaffleManagement({ raffles, onUpdate, loading }: RaffleManagementProps) {
  const account = useCurrentAccount()
  const { endRaffle, withdrawAdminFee } = useRaffleContract()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleEndRaffle = async (raffleId: string) => {
    if (!account) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      const tx = await endRaffle(raffleId)
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("🏁 Raffle ended successfully!")
            onUpdate()
            setActiveDropdown(null)
          },
          onError: (error) => {
            console.error("Error ending raffle:", error)
            toast.error("Failed to end raffle")
          },
        },
      )
    } catch (error) {
      console.error("Error ending raffle:", error)
      toast.error("Failed to end raffle")
    }
  }

  const handleWithdrawFee = async (raffleId: string) => {
    if (!account) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      const tx = await withdrawAdminFee(raffleId)
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("💰 Admin fee withdrawn successfully!")
            onUpdate()
            setActiveDropdown(null)
          },
          onError: (error) => {
            console.error("Error withdrawing fee:", error)
            toast.error("Failed to withdraw fee")
          },
        },
      )
    } catch (error) {
      console.error("Error withdrawing fee:", error)
      toast.error("Failed to withdraw fee")
    }
  }

  const activeRaffles = raffles.filter((r) => r.info.active)
  const completedRaffles = raffles.filter((r) => !r.info.active)

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading raffles...</p>
      </div>
    )
  }

  return (
    <div className={styles.managementContainer}>
      {/* Active Raffles */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <Play className={styles.sectionIcon} />
            Active Raffles ({activeRaffles.length})
          </h3>
        </div>

        {activeRaffles.length > 0 ? (
          <div className={styles.raffleGrid}>
            {activeRaffles.map((raffle) => (
              <RaffleManagementCard
                key={raffle.id}
                raffle={raffle}
                onEndRaffle={handleEndRaffle}
                onWithdrawFee={handleWithdrawFee}
                isPending={isPending}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Play className={styles.emptyIcon} />
            <p className={styles.emptyText}>No active raffles</p>
            <p className={styles.emptySubtext}>Create a new raffle to get started</p>
          </div>
        )}
      </div>

      {/* Completed Raffles */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <Square className={styles.sectionIcon} />
            Completed Raffles ({completedRaffles.length})
          </h3>
        </div>

        {completedRaffles.length > 0 ? (
          <div className={styles.raffleGrid}>
            {completedRaffles.map((raffle) => (
              <RaffleManagementCard
                key={raffle.id}
                raffle={raffle}
                onEndRaffle={handleEndRaffle}
                onWithdrawFee={handleWithdrawFee}
                isPending={isPending}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Square className={styles.emptyIcon} />
            <p className={styles.emptyText}>No completed raffles</p>
            <p className={styles.emptySubtext}>Completed raffles will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface RaffleManagementCardProps {
  raffle: { id: string; info: RaffleInfo }
  onEndRaffle: (id: string) => void
  onWithdrawFee: (id: string) => void
  isPending: boolean
  activeDropdown: string | null
  setActiveDropdown: (id: string | null) => void
}

function RaffleManagementCard({
  raffle,
  onEndRaffle,
  onWithdrawFee,
  isPending,
  activeDropdown,
  setActiveDropdown,
}: RaffleManagementCardProps) {
  const { id, info } = raffle
  const canEnd = info.active && Date.now() >= info.endTime
  const canWithdraw = !info.active && info.adminFeeValue > 0

  return (
    <div className={styles.raffleCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <h4 className={styles.raffleTitle}>Round #{id.slice(-6)}</h4>
          <div className={`${styles.statusBadge} ${info.active ? styles.activeBadge : styles.completedBadge}`}>
            {info.active ? "Active" : "Completed"}
          </div>
        </div>
        <div className={styles.cardActions}>
          <button className={styles.actionButton} onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}>
            <MoreVertical className={styles.actionIcon} />
          </button>
          {activeDropdown === id && (
            <div className={styles.dropdown}>
              {canEnd && (
                <button onClick={() => onEndRaffle(id)} disabled={isPending} className={styles.dropdownItem}>
                  <Square className={styles.dropdownIcon} />
                  End Raffle
                </button>
              )}
              {canWithdraw && (
                <button onClick={() => onWithdrawFee(id)} disabled={isPending} className={styles.dropdownItem}>
                  <DollarSign className={styles.dropdownIcon} />
                  Withdraw Fee
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardStats}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <DollarSign className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {formatSui(info.prizePoolValue)}
              <Image src="/images/sui-logo.png" alt="SUI" width={16} height={16} className={styles.currencyIcon} />
            </div>
            <div className={styles.statLabel}>Prize Pool</div>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Users className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{info.totalTickets}</div>
            <div className={styles.statLabel}>Tickets Sold</div>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Trophy className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{info.numWinners}</div>
            <div className={styles.statLabel}>Winners</div>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <Clock className={styles.statIconSvg} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{info.active ? "Active" : "Ended"}</div>
            <div className={styles.statLabel}>Status</div>
          </div>
        </div>
      </div>

      {info.adminFeeValue > 0 && (
        <div className={styles.feeInfo}>
          <div className={styles.feeLabel}>Admin Fee Available:</div>
          <div className={styles.feeValue}>
            {formatSui(info.adminFeeValue)}
            <Image src="/images/sui-logo.png" alt="SUI" width={14} height={14} className={styles.currencyIcon} />
          </div>
        </div>
      )}
    </div>
  )
}
