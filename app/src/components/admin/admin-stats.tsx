"use client"

import { useMemo } from "react"
import { formatSui } from "@/config/constants"
import type { RaffleInfo } from "@/types/raffle"
import { TrendingUp, Users, Trophy, DollarSign, Activity, Target } from "lucide-react"
import Image from "next/image"
import styles from "./admin-stats.module.css"

interface AdminStatsProps {
  raffles: Array<{ id: string; info: RaffleInfo }>
  loading: boolean
}

export function AdminStats({ raffles, loading }: AdminStatsProps) {
  const stats = useMemo(() => {
    const activeRaffles = raffles.filter((r) => r.info.active)
    const completedRaffles = raffles.filter((r) => !r.info.active)

    const totalPrizePool = raffles.reduce((sum, r) => sum + r.info.prizePoolValue, 0)
    const totalTickets = raffles.reduce((sum, r) => sum + r.info.totalTickets, 0)
    const totalFees = raffles.reduce((sum, r) => sum + r.info.adminFeeValue, 0)
    const totalWinners = completedRaffles.reduce((sum, r) => sum + r.info.winners.length, 0)

    return {
      activeRaffles: activeRaffles.length,
      completedRaffles: completedRaffles.length,
      totalPrizePool,
      totalTickets,
      totalFees,
      totalWinners,
    }
  }, [raffles])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading admin statistics...</p>
      </div>
    )
  }

  return (
    <div className={styles.statsContainer}>
      {/* Header */}
      <div className={styles.statsHeader}>
        <h2 className={styles.statsTitle}>WheatChain Raffle Analytics</h2>
        <p className={styles.statsSubtitle}>Real-time overview of your DeFi raffle ecosystem</p>
      </div>

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIcon}>
              <Activity className={styles.iconSvg} />
            </div>
            <div className={styles.statBadge}>Live</div>
          </div>
          <div className={styles.statValue}>{stats.activeRaffles}</div>
          <div className={styles.statLabel}>Active Raffles</div>
          <div className={styles.statTrend}>
            <TrendingUp className={styles.trendIcon} />
            <span>Currently running</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIcon}>
              <DollarSign className={styles.iconSvg} />
            </div>
            <div className={styles.statCurrency}>
              <Image src="/images/sui-logo.png" alt="SUI" width={16} height={16} />
            </div>
          </div>
          <div className={styles.statValue}>{formatSui(stats.totalPrizePool)}</div>
          <div className={styles.statLabel}>Total Prize Pool</div>
          <div className={styles.statTrend}>
            <span className={styles.statSubtext}>Across all raffles</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIcon}>
              <Users className={styles.iconSvg} />
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalTickets.toLocaleString()}</div>
          <div className={styles.statLabel}>Total Tickets Sold</div>
          <div className={styles.statTrend}>
            <span className={styles.statSubtext}>All-time participation</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIcon}>
              <Trophy className={styles.iconSvg} />
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalWinners}</div>
          <div className={styles.statLabel}>Total Winners</div>
          <div className={styles.statTrend}>
            <span className={styles.statSubtext}>Happy participants</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIcon}>
              <Target className={styles.iconSvg} />
            </div>
          </div>
          <div className={styles.statValue}>{stats.completedRaffles}</div>
          <div className={styles.statLabel}>Completed Raffles</div>
          <div className={styles.statTrend}>
            <span className={styles.statSubtext}>Successfully finished</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <div className={styles.statIcon}>
              <DollarSign className={styles.iconSvg} />
            </div>
            <div className={styles.statCurrency}>
              <Image src="/images/sui-logo.png" alt="SUI" width={16} height={16} />
            </div>
          </div>
          <div className={styles.statValue}>{formatSui(stats.totalFees)}</div>
          <div className={styles.statLabel}>Admin Fees Collected</div>
          <div className={styles.statTrend}>
            <span className={styles.statSubtext}>Protocol revenue</span>
          </div>
        </div>
      </div>

      {/* Featured Prizes Section */}
      <div className={styles.featuredSection}>
        <h3 className={styles.featuredTitle}>Featured Prize Pools</h3>
        <div className={styles.featuredGrid}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredImage}>
              <Image src="/images/usdt-logo.png" alt="USDT" width={48} height={48} />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.featuredAmount}>10,000 USDT</div>
              <div className={styles.featuredLabel}>Up for Grabs</div>
            </div>
          </div>

          <div className={styles.featuredCard}>
            <div className={styles.featuredImage}>
              <Image src="/images/usdt-logo.png" alt="USDT" width={48} height={48} />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.featuredAmount}>1,000 USDT</div>
              <div className={styles.featuredLabel}>Weekly Prize</div>
            </div>
          </div>

          <div className={styles.featuredCard}>
            <div className={styles.featuredImage}>
              <Image src="/images/sui-logo.png" alt="SUI" width={48} height={48} />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.featuredAmount}>100+ SUI</div>
              <div className={styles.featuredLabel}>Daily Rewards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
