"use client"

import { useState } from "react"
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { useRaffleContract } from "@/hooks/useRaffleContract"
import { formatSui, mistToSui, suiToMist } from "@/config/constants"
import { CountdownTimer } from "./countdown-timer"
import toast from "react-hot-toast"
import styles from "./raffle-card.module.css"
import Image from "next/image"

interface RaffleCardProps {
  raffleId: string
  raffleInfo: {
    ticketPrice: number
    endTime: number
    prizePoolValue: number
    totalTickets: number
    numWinners: number
    active: boolean
  }
  userTickets: number[]
  onUpdate: () => void
}

export function RaffleCard({ raffleId, raffleInfo, userTickets, onUpdate }: RaffleCardProps) {
  const account = useCurrentAccount()
  const { buyTicket } = useRaffleContract()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [suiAmount, setSuiAmount] = useState("1.0")

  const handleBuyTickets = async () => {
    if (!account) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      const amount = suiToMist(Number.parseFloat(suiAmount))
      const tx = await buyTicket(raffleId, amount)

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("🎫 Tickets purchased successfully!")
            onUpdate()
          },
          onError: (error) => {
            console.error("Error buying tickets:", error)
            toast.error("Failed to purchase tickets")
          },
        },
      )
    } catch (error) {
      console.error("Error buying tickets:", error)
      toast.error("Failed to purchase tickets")
    }
  }

  const ticketCount = Math.floor(Number.parseFloat(suiAmount || "0") / mistToSui(raffleInfo.ticketPrice))
  const prizePerWinner = raffleInfo.prizePoolValue / raffleInfo.numWinners

  const handleMaxAmount = () => {
    // This would be replaced with actual wallet balance logic
    setSuiAmount("5.0")
  }

  const handlePercentage = (percentage: number) => {
    // This would be replaced with actual wallet balance logic
    const maxAmount = 5.0
    setSuiAmount((maxAmount * percentage).toFixed(1))
  }

  return (
    <div className={styles.raffleCard}>
      <div className={styles.raffleHeader}>
        <h2 className={styles.raffleTitle}>Round #{raffleId.slice(-6)}</h2>
        <div className={styles.raffleSubtitle}>{raffleInfo.active ? "Active Round" : "Round Ended"}</div>
      </div>

      {raffleInfo.active && (
        <div className={styles.countdownSection}>
          <h3 className={styles.sectionTitle}>Time left to join:</h3>
          <CountdownTimer endTime={raffleInfo.endTime} onComplete={onUpdate} />
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Prize Pool</div>
          <div className={styles.statValue}>
            <Image src="/images/sui-logo.png" alt="SUI" width={20} height={20} className={styles.suiIcon} />
            {formatSui(prizePerWinner)}
          </div>
          <div className={styles.statSubtext}>per winner</div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Total Deposit</div>
          <div className={styles.statValue}>
            <Image src="/images/sui-logo.png" alt="SUI" width={20} height={20} className={styles.suiIcon} />
            {formatSui(raffleInfo.prizePoolValue)}
          </div>
          <div className={styles.statSubtext}>{raffleInfo.totalTickets} tickets</div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Ticket Price</div>
          <div className={styles.statValue}>
            <Image src="/images/sui-logo.png" alt="SUI" width={20} height={20} className={styles.suiIcon} />
            {formatSui(raffleInfo.ticketPrice)}
          </div>
          <div className={styles.statSubtext}>per ticket</div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statLabel}>Winners</div>
          <div className={styles.statValue}>{raffleInfo.numWinners}</div>
          <div className={styles.statSubtext}>lucky players</div>
        </div>
      </div>

      {raffleInfo.active ? (
        <div className={styles.participationSection}>
          <div className={styles.depositSection}>
            <h3 className={styles.sectionTitle}>Deposit to WIN</h3>
            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  value={suiAmount}
                  onChange={(e) => setSuiAmount(e.target.value)}
                  min={mistToSui(raffleInfo.ticketPrice)}
                  step="0.1"
                  className={styles.suiInput}
                  placeholder="Enter SUI amount"
                />
               <div className={styles.suiLabel}>
  <Image src="/images/sui-logo.png" alt="SUI" width={16} height={16} className={styles.suiIcon} />
  SUI
</div>
              </div>
              <div className={styles.percentageButtons}>
                <button onClick={() => handlePercentage(0.5)} className={styles.percentButton}>
                  50%
                </button>
                <button onClick={() => handlePercentage(0.75)} className={styles.percentButton}>
                  75%
                </button>
                <button onClick={handleMaxAmount} className={styles.percentButton}>
                  Max
                </button>
              </div>
            </div>

            <div className={styles.ticketPreview}>
              <div className={styles.ticketPreviewLabel}>You will receive</div>
              <div className={styles.ticketCount}>
                {ticketCount} Ticket{ticketCount !== 1 ? "s" : ""}
              </div>
            </div>

            <button
              onClick={handleBuyTickets}
              disabled={isPending || ticketCount === 0 || !account}
              className={styles.buyButton}
            >
              {isPending ? (
                <>
                  <div className={styles.spinner}></div>
                  Processing...
                </>
              ) : !account ? (
                "Connect Wallet"
              ) : (
                `Buy ${ticketCount} Ticket${ticketCount !== 1 ? "s" : ""}`
              )}
            </button>
          </div>

          <div className={styles.ticketsSection}>
            <h3 className={styles.sectionTitle}>Your Tickets</h3>
            {userTickets.length > 0 ? (
              <>
                <div className={styles.ticketsList}>
                  {userTickets.map((ticketNumber) => (
                    <div key={ticketNumber} className={styles.ticketItem}>
                      #{ticketNumber}
                    </div>
                  ))}
                </div>
                <div className={styles.ticketStats}>
                  <div className={styles.ticketStatsLabel}>Total Tickets Owned</div>
                  <div className={styles.ticketStatsValue}>{userTickets.length}</div>
                </div>
              </>
            ) : (
              <div className={styles.emptyTickets}>
                <div className={styles.emptyTicketsIcon}>🎫</div>
                <p className={styles.emptyTicketsText}>You don't have any tickets yet</p>
                <p className={styles.emptyTicketsSubtext}>Buy your first ticket to participate!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.resultsSection}>
          <h3 className={styles.sectionTitle}>Winners</h3>
          <div className={styles.winnersList}>
            {/* This would be populated with actual winners */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className={styles.winnerItem}>
                <div className={styles.winnerAvatar}>👑</div>
                <div className={styles.winnerAddress}>
                  0x{Math.random().toString(16).slice(2, 10)}...{Math.random().toString(16).slice(2, 6)}
                </div>
                <div className={styles.winnerPrize}>{formatSui(prizePerWinner)} SUI</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
