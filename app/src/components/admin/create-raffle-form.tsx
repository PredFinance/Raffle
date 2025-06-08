"use client"

import type React from "react"

import { useState } from "react"
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { useRaffleContract } from "@/hooks/useRaffleContract"
import { suiToMist } from "@/config/constants"
import { Plus, Clock, DollarSign, Users, Percent } from "lucide-react"
import Image from "next/image"
import toast from "react-hot-toast"
import styles from "./create-raffle-form.module.css"

interface CreateRaffleFormProps {
  onSuccess?: () => void
}

export function CreateRaffleForm({ onSuccess }: CreateRaffleFormProps) {
  const account = useCurrentAccount()
  const { createRaffle } = useRaffleContract()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

  const [formData, setFormData] = useState({
    ticketPrice: "0.5",
    durationHours: "24",
    feePercentage: "10",
    numWinners: "1",
    title: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!account) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      const params = {
        ticketPrice: suiToMist(Number.parseFloat(formData.ticketPrice)),
        durationMs: Number.parseInt(formData.durationHours) * 60 * 60 * 1000,
        feePercentage: Number.parseInt(formData.feePercentage),
        numWinners: Number.parseInt(formData.numWinners),
      }

      const tx = await createRaffle(params)

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            toast.success("🎉 Raffle created successfully!")
            onSuccess?.()
            setFormData({
              ticketPrice: "0.5",
              durationHours: "24",
              feePercentage: "10",
              numWinners: "1",
              title: "",
              description: "",
            })
          },
          onError: (error) => {
            console.error("Error creating raffle:", error)
            toast.error("Failed to create raffle")
          },
        },
      )
    } catch (error) {
      console.error("Error creating raffle:", error)
      toast.error("Failed to create raffle")
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.formIcon}>
          <Plus className={styles.iconSvg} />
        </div>
        <h2 className={styles.formTitle}>Create New Raffle</h2>
        <p className={styles.formSubtitle}>Launch a new gamified raffle for the WheatChain community</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Basic Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Raffle Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className={styles.textInput}
                placeholder="e.g., Weekly USDT Giveaway"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className={styles.textArea}
                placeholder="Describe your raffle..."
                rows={3}
              />
            </div>
          </div>

          {/* Raffle Configuration */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Raffle Configuration</h3>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <DollarSign className={styles.labelIcon} />
                  Ticket Price (SUI)
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.ticketPrice}
                    onChange={(e) => updateFormData("ticketPrice", e.target.value)}
                    className={styles.numberInput}
                    required
                  />
                  <div className={styles.inputSuffix}>
                    <Image src="/images/sui-logo.png" alt="SUI" width={16} height={16} />
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Clock className={styles.labelIcon} />
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.durationHours}
                  onChange={(e) => updateFormData("durationHours", e.target.value)}
                  className={styles.numberInput}
                  required
                />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Users className={styles.labelIcon} />
                  Number of Winners
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numWinners}
                  onChange={(e) => updateFormData("numWinners", e.target.value)}
                  className={styles.numberInput}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>
                  <Percent className={styles.labelIcon} />
                  Admin Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.feePercentage}
                  onChange={(e) => updateFormData("feePercentage", e.target.value)}
                  className={styles.numberInput}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className={styles.previewSection}>
          <h3 className={styles.sectionTitle}>Raffle Preview</h3>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <h4 className={styles.previewTitle}>{formData.title || "New WheatChain Raffle"}</h4>
              <div className={styles.previewBadge}>Preview</div>
            </div>
            <div className={styles.previewStats}>
              <div className={styles.previewStat}>
                <span className={styles.previewStatLabel}>Ticket Price</span>
                <span className={styles.previewStatValue}>{formData.ticketPrice} SUI</span>
              </div>
              <div className={styles.previewStat}>
                <span className={styles.previewStatLabel}>Duration</span>
                <span className={styles.previewStatValue}>{formData.durationHours}h</span>
              </div>
              <div className={styles.previewStat}>
                <span className={styles.previewStatLabel}>Winners</span>
                <span className={styles.previewStatValue}>{formData.numWinners}</span>
              </div>
              <div className={styles.previewStat}>
                <span className={styles.previewStatLabel}>Fee</span>
                <span className={styles.previewStatValue}>{formData.feePercentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isPending || !account} className={styles.submitButton}>
          {isPending ? (
            <>
              <div className={styles.spinner}></div>
              Creating Raffle...
            </>
          ) : !account ? (
            "Connect Wallet to Create"
          ) : (
            <>
              <Plus className={styles.buttonIcon} />
              Create Raffle
            </>
          )}
        </button>
      </form>
    </div>
  )
}
