import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { HandoverItem } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

interface HandoverCardProps {
  item: HandoverItem;
  onStepToggle: (handoverId: string, stepId: string) => void;
}

const stepIconMap: Record<string, string> = {
  clean: '🧹',
  cool: '❄️',
  energy: '⚡',
  handover: '🤝'
}

const HandoverCard: React.FC<HandoverCardProps> = ({ item, onStepToggle }) => {
  const { submitHandoverEnergy, setHandoverEnergy, toggleHandoverStep } = useAppStore()
  const completedCount = item.steps.filter(s => s.completed).length
  const totalSteps = item.steps.length
  const energyStep = item.steps.find(s => s.type === 'energy')
  const [energyValue, setEnergyValue] = useState(item.energyInput || '')
  const [showEnergyInput, setShowEnergyInput] = useState(false)

  const handleEnergyClick = () => {
    if (energyStep?.completed) return
    setShowEnergyInput(true)
  }

  const handleEnergyChange = (e: any) => {
    const val = e.detail?.value ?? e.target?.value ?? ''
    setEnergyValue(val)
    setHandoverEnergy(item.id, val)
  }

  const handleEnergyConfirm = () => {
    if (!energyValue.trim()) {
      Taro.showToast({ title: '请输入能量档位', icon: 'none' })
      return
    }
    const success = submitHandoverEnergy(item.id, energyValue.trim())
    if (success) {
      Taro.showToast({ title: '能量已记录！+5积分', icon: 'success' })
      setShowEnergyInput(false)
    } else {
      Taro.showToast({ title: '已录入过能量值', icon: 'none' })
      setShowEnergyInput(false)
    }
  }

  const handleStepClick = (step: typeof item.steps[0]) => {
    if (step.type === 'energy') {
      handleEnergyClick()
      return
    }
    if (step.type === 'handover') {
      const cleanDone = item.steps.find(s => s.type === 'clean')?.completed
      const coolDone = item.steps.find(s => s.type === 'cool')?.completed
      const energyDone = item.steps.find(s => s.type === 'energy')?.completed
      if (!cleanDone || !coolDone || !energyDone) {
        Taro.showToast({ title: '请先完成前面的步骤', icon: 'none' })
        return
      }
    }
    onStepToggle(item.id, step.id)
    if (step.type === 'handover') {
      const currentHandover = useAppStore.getState().handovers.find(h => h.id === item.id)
      if (currentHandover?.isCompleted) {
        Taro.showToast({ title: '交接完成！+10积分', icon: 'success' })
      }
    }
  }

  return (
    <View className={styles.card}>
      <View className={styles.cardHeader}>
        <View className={styles.customerName}>{item.customerName}</View>
        <View className={styles.progress}>
          <Text className={styles.progressText}>{completedCount}/{totalSteps}</Text>
        </View>
      </View>

      {item.delayMinutes > 0 && (
        <View className={styles.delayBanner}>
          <Text className={styles.delayIcon}>⏰</Text>
          <View className={styles.delayContent}>
            <Text className={styles.delayTitle}>超时{item.delayMinutes}分钟</Text>
            <Text className={styles.delayReason}>{item.delayReason}</Text>
          </View>
        </View>
      )}

      {item.delayMinutes > 0 && item.delayScript && (
        <View className={styles.scriptBox}>
          <Text className={styles.scriptLabel}>💡 建议话术</Text>
          <Text className={styles.scriptText}>{item.delayScript}</Text>
        </View>
      )}

      <View className={styles.steps}>
        {item.steps.map((step) => {
          const isEnergy = step.type === 'energy'
          return (
            <View key={step.id}>
              <View
                className={classnames(styles.step, step.completed && styles.stepDone)}
                onClick={() => handleStepClick(step)}
              >
                <View className={classnames(styles.stepCheck, step.completed && styles.stepCheckDone)}>
                  {step.completed && <Text className={styles.stepCheckMark}>✓</Text>}
                </View>
                <Text className={styles.stepIcon}>{stepIconMap[step.type]}</Text>
                <Text className={styles.stepTitle}>{step.title}</Text>
                {isEnergy && !step.completed && (
                  <Text className={styles.stepEdit}>录入</Text>
                )}
              </View>
              {isEnergy && showEnergyInput && !energyStep?.completed && (
                <View className={styles.energyInputWrap}>
                  <Input
                    className={styles.energyInput}
                    type="digit"
                    value={energyValue}
                    placeholder="例如: 2.5 或 3.0"
                    onInput={handleEnergyChange}
                  />
                  <View className={styles.energyConfirmBtn} onClick={handleEnergyConfirm}>
                    <Text className={styles.energyConfirmText}>确认</Text>
                  </View>
                </View>
              )}
            </View>
          )
        })}
      </View>

      {item.isCompleted && (
        <View className={styles.completedBanner}>
          <Text className={styles.completedIcon}>🎉</Text>
          <Text className={styles.completedText}>交接完成！共+15积分</Text>
        </View>
      )}
    </View>
  )
}

export default HandoverCard
