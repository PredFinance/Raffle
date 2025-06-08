"use client"

import { useState, useEffect } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { WalletConnection } from "@/components/wallet-connection"
import { BackgroundEffect } from "@/components/background-effect"
import { RaffleCard } from "@/components/raffle-card"
import { useRaffleContract } from "@/hooks/useRaffleContract"
import type { RaffleInfo } from "@/types/raffle"
import styles from "./page.module.css"

export default function Home() {
  const account = useCurrentAccount()
  const { getRaffleInfo, getAllRaffles, getUserTickets } = useRaffleContract()

  const [currentRaffle, setCurrentRaffle] = useState<{ id: string; info: RaffleInfo } | null>(null)
  const [pastRaffles, setPastRaffles] = useState<Array<{ id: string; info: RaffleInfo }>>([])
  const [userTickets, setUserTickets] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("current")

  // Fetch raffles
  const fetchRaffles = async () => {
    setLoading(true)
    try {
      const raffleIds = await getAllRaffles()

      // Process raffles
      const raffleData = await Promise.all(
        raffleIds.map(async (id: string) => {
          const info = await getRaffleInfo(id)
          return info ? { id, info } : null
        }),
      )

      const validRaffles = raffleData.filter(Boolean) as Array<{ id: string; info: RaffleInfo }>

      // Find current active raffle
      const active = validRaffles.find((raffle) => raffle.info.active)
      if (active) {
        setCurrentRaffle(active)

        // Fetch user tickets for current raffle
        if (account) {
          const tickets = await getUserTickets(active.id, account.address)
          setUserTickets(tickets)
        }
      }

      // Set past raffles
      setPastRaffles(validRaffles.filter((raffle) => !raffle.info.active).slice(0, 5))
    } catch (error) {
      console.error("Error fetching raffles:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user tickets when account changes
  useEffect(() => {
    if (account && currentRaffle) {
      getUserTickets(currentRaffle.id, account.address).then(setUserTickets)
    } else {
      setUserTickets([])
    }
  }, [account, currentRaffle, getUserTickets])

  // Initial fetch
  useEffect(() => {
    fetchRaffles()
  }, [])

  return (
    <>
      <BackgroundEffect />

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <WalletConnection />
        </header>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              WheatChain <span className={styles.titleHighlight}>Raffle</span>
            </h1>
            <p className={styles.subtitle}>
              Join WheatChain's gamified raffle system. Modular DeFi protocol offering liquid staking, yield strategies,
              and gamified rewards — built on Sui.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className={styles.mainContent}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "current" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("current")}
            >
              Current Round
            </button>
            <button
              className={`${styles.tab} ${activeTab === "past" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("past")}
            >
              Past Rounds
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Loading raffles...</p>
              </div>
            ) : activeTab === "current" ? (
              currentRaffle ? (
                <RaffleCard
                  raffleId={currentRaffle.id}
                  raffleInfo={currentRaffle.info}
                  userTickets={userTickets}
                  onUpdate={fetchRaffles}
                />
              ) : (
                <div className={styles.noRaffleContainer}>
                  <h2 className={styles.noRaffleTitle}>No Active Raffle</h2>
                  <p className={styles.noRaffleText}>Check back soon for the next exciting round!</p>
                </div>
              )
            ) : (
              <div className={styles.pastRafflesContainer}>
                {pastRaffles.length > 0 ? (
                  pastRaffles.map((raffle) => (
                    <RaffleCard
                      key={raffle.id}
                      raffleId={raffle.id}
                      raffleInfo={raffle.info}
                      userTickets={[]}
                      onUpdate={fetchRaffles}
                    />
                  ))
                ) : (
                  <div className={styles.noRaffleContainer}>
                    <h2 className={styles.noRaffleTitle}>No Past Raffles</h2>
                    <p className={styles.noRaffleText}>Completed raffles will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorksSection}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Connect Wallet</h3>
              <p className={styles.stepDescription}>Connect your Sui wallet to participate in the raffle</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Buy Tickets</h3>
              <p className={styles.stepDescription}>Purchase tickets with SUI to enter the current round</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Wait for Results</h3>
              <p className={styles.stepDescription}>Winners are selected randomly when the round ends</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Claim Prizes</h3>
              <p className={styles.stepDescription}>Winners receive prizes automatically in their wallet</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© 2025 WheatChain Raffle. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
