import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import HandoverCard from '@/components/HandoverCard';
import styles from './index.module.scss';

type TabType = 'pending' | 'completed'

const HIGH_ENERGY_THRESHOLD = 4.0

const HandoverPage: React.FC = () => {
  const { handovers, tasks, toggleHandoverStep } = useAppStore()
  const [tab, setTab] = useState<TabType>('pending')
  const [showReview, setShowReview] = useState(false)

  const pendingHandovers = useMemo(
    () => handovers.filter(h => !h.isCompleted),
    [handovers]
  )

  const completedHandovers = useMemo(
    () => handovers.filter(h => h.isCompleted),
    [handovers]
  )

  const displayList = tab === 'pending' ? pendingHandovers : completedHandovers

  const tasksWithEnergy = useMemo(
    () => tasks.filter(t => t.energyLevel && t.status !== 'pending'),
    [tasks]
  )

  const tasksMissingEnergy = useMemo(
    () => tasks.filter(t => t.status !== 'pending' && !t.energyLevel),
    [tasks]
  )

  const equipmentGroups = useMemo(() => {
    const map = new Map<string, { equipment: string; records: { customer: string; energy: string; taskId: string; isHigh: boolean }[] }>()
    tasksWithEnergy.forEach(t => {
      const energyNum = parseFloat(t.energyLevel)
      const isHigh = !isNaN(energyNum) && energyNum >= HIGH_ENERGY_THRESHOLD
      if (!map.has(t.equipment)) {
        map.set(t.equipment, { equipment: t.equipment, records: [] })
      }
      map.get(t.equipment)!.records.push({
        customer: t.customerName,
        energy: t.energyLevel,
        taskId: t.id,
        isHigh
      })
    })
    return Array.from(map.values())
  }, [tasksWithEnergy])

  const duplicateWarnings = useMemo(() => {
    const seen = new Map<string, string[]>()
    tasksWithEnergy.forEach(t => {
      const key = `${t.equipment}_${t.energyLevel}`
      if (!seen.has(key)) seen.set(key, [])
      seen.get(key)!.push(t.customerName)
    })
    return Array.from(seen.entries())
      .filter(([, names]) => names.length > 1)
      .map(([key, names]) => {
        const [equipment, energy] = key.split('_')
        return { equipment, energy, customers: names }
      })
  }, [tasksWithEnergy])

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>交接中心 🤝</Text>
        <Text className={styles.subtitle}>完成治疗后按步骤交接</Text>
      </View>

      {tasksWithEnergy.length > 0 && (
        <View className={styles.energySection}>
          <View className={styles.energyHeader}>
            <Text className={styles.energyTitle}>⚡ 今日能量记录</Text>
            <View
              className={classnames(styles.reviewToggle, showReview && styles.reviewToggleActive)}
              onClick={() => setShowReview(!showReview)}
            >
              <Text className={styles.reviewToggleText}>{showReview ? '收起复盘' : '📊 复盘'}</Text>
            </View>
          </View>

          {showReview ? (
            <View className={styles.reviewPanel}>
              {equipmentGroups.map(group => (
                <View key={group.equipment} className={styles.reviewGroup}>
                  <Text className={styles.reviewGroupTitle}>{group.equipment}</Text>
                  {group.records.map((rec, idx) => (
                    <View key={idx} className={classnames(styles.reviewRecord, rec.isHigh && styles.reviewHigh)}>
                      <Text className={styles.reviewCustomer}>{rec.customer}</Text>
                      <Text className={classnames(styles.reviewEnergy, rec.isHigh && styles.reviewEnergyHigh)}>
                        {rec.energy}
                      </Text>
                      {rec.isHigh && <Text className={styles.reviewWarnTag}>偏高</Text>}
                    </View>
                  ))}
                </View>
              ))}

              {duplicateWarnings.length > 0 && (
                <View className={styles.reviewWarning}>
                  <Text className={styles.reviewWarningTitle}>🔄 疑似重复</Text>
                  {duplicateWarnings.map((w, idx) => (
                    <Text key={idx} className={styles.reviewWarningText}>
                      {w.equipment} 档位 {w.energy} 出现 {w.customers.length} 次（{w.customers.join('、')}）
                    </Text>
                  ))}
                </View>
              )}

              {tasksMissingEnergy.length > 0 && (
                <View className={styles.reviewWarning}>
                  <Text className={styles.reviewWarningTitle}>⚠️ 待补录</Text>
                  {tasksMissingEnergy.map(t => (
                    <Text key={t.id} className={styles.reviewWarningText}>
                      {t.customerName} · {t.equipment}（{t.treatmentArea}）
                    </Text>
                  ))}
                </View>
              )}

              {tasksMissingEnergy.length === 0 && duplicateWarnings.length === 0 && (
                <View className={styles.reviewAllGood}>
                  <Text className={styles.reviewAllGoodText}>✅ 今日能量记录完整，无异常</Text>
                </View>
              )}
            </View>
          ) : (
            <View className={styles.energyGrid}>
              {tasksWithEnergy.map(task => (
                <View key={task.id} className={styles.energyItem}>
                  <Text className={styles.energyEquipment}>{task.equipment}</Text>
                  <Text className={styles.energyValue}>{task.energyLevel}</Text>
                  <Text className={styles.energyCustomer}>{task.customerName}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View className={styles.tabRow}>
        <View
          className={classnames(styles.tab, tab === 'pending' && styles.tabActive)}
          onClick={() => setTab('pending')}
        >
          <Text className={styles.tabText}>待交接 ({pendingHandovers.length})</Text>
        </View>
        <View
          className={classnames(styles.tab, tab === 'completed' && styles.tabActive)}
          onClick={() => setTab('completed')}
        >
          <Text className={styles.tabText}>已完成 ({completedHandovers.length})</Text>
        </View>
      </View>

      <View className={styles.list}>
        {displayList.map(item => (
          <HandoverCard
            key={item.id}
            item={item}
            onStepToggle={toggleHandoverStep}
          />
        ))}
        {displayList.length === 0 && (
          <Text className={styles.emptyTip}>
            {tab === 'pending' ? '暂无待交接任务 🎉' : '暂无已完成交接'}
          </Text>
        )}
      </View>
    </View>
  )
}

export default HandoverPage
