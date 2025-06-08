"use client"

import { useState, useEffect } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { WalletConnection } from "@/components/wallet-connection"
import { BackgroundEffect } from "@/components/background-effect"
import { CreateRaffleForm } from "@/components/admin/create-raffle-form"
import { AdminStats } from "@/components/admin/admin-stats"
import { RaffleManagement } from "@/components/admin/raffle-management"
import { useRaffleContract } from "@/hooks/useRaffleContract"
import type { RaffleInfo } from "@/types/raffle"
import { Shield, Plus, BarChart3, Settings } from "lucide-react"
import styles from "./admin.module.css"

export default function AdminPage() {
  const account = useCurrentAccount()
  const { getAllRaffles, getRaffleInfo } = useRaffleContract()

  const [activeTab, setActiveTab] = useState("overview")
  const [raffles, setRaffles] = useState<Array<{ id: string; info: RaffleInfo }>>([])
  const [loading, setLoading] = useState(true)

  // Fetch all raffles for admin overview
  const fetchRaffles = async () => {
    setLoading(true)
    try {
      const raffleIds = await getAllRaffles()
      const raffleData = await Promise.all(
        raffleIds.map(async (id: string) => {
          const info = await getRaffleInfo(id)
          return info ? { id, info } : null
        }),
      )
      setRaffles(raffleData.filter(Boolean) as Array<{ id: string; info: RaffleInfo }>)
    } catch (error) {
      console.error("Error fetching raffles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRaffles()
  }, [])

  if (!account) {
    return (
      <>
        <BackgroundEffect />
        <div className={styles.container}>
          <header className={styles.header}>
            <WalletConnection />
          </header>
          <div className={styles.unauthorizedContainer}>
            <Shield className={styles.unauthorizedIcon} />
            <h1 className={styles.unauthorizedTitle}>Admin Access Required</h1>
            <p className={styles.unauthorizedText}>Connect your wallet to access the WheatChain admin dashboard</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <BackgroundEffect />
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <Shield className={styles.headerIcon} />
              <div>
                <h1 className={styles.headerTitle}>WheatChain Admin</h1>
                <p className={styles.headerSubtitle}>Raffle Management Dashboard</p>
              </div>
            </div>
            <WalletConnection />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className={styles.navigation}>
          <button
            className={`${styles.navTab} ${activeTab === "overview" ? styles.activeNavTab : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className={styles.navIcon} />
            Overview
          </button>
          <button
            className={`${styles.navTab} ${activeTab === "create" ? styles.activeNavTab : ""}`}
            onClick={() => setActiveTab("create")}
          >
            <Plus className={styles.navIcon} />
            Create Raffle
          </button>
          <button
            className={`${styles.navTab} ${activeTab === "manage" ? styles.activeNavTab : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            <Settings className={styles.navIcon} />
            Manage Raffles
          </button>
        </nav>

        {/* Tab Content */}
        <main className={styles.mainContent}>
          {activeTab === "overview" && (
            <div className={styles.overviewTab}>
              <AdminStats raffles={raffles} loading={loading} />
            </div>
          )}

          {activeTab === "create" && (
            <div className={styles.createTab}>
              <CreateRaffleForm onSuccess={fetchRaffles} />
            </div>
          )}

          {activeTab === "manage" && (
            <div className={styles.manageTab}>
              <RaffleManagement raffles={raffles} onUpdate={fetchRaffles} loading={loading} />
            </div>
          )}
        </main>
      </div>
    </>
  )
}
