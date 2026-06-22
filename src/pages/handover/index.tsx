import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import HandoverCard from '@/components/HandoverCard';
import styles from './index.module.scss';

type TabType = 'pending' | 'completed'

const HandoverPage: React.FC = () => {
  const { handovers, tasks, toggleHandoverStep } = useAppStore()
  const [tab, setTab] = useState<TabType>('pending')

  const pendingHandovers = useMemo(
    () => handovers.filter(h => !h.isCompleted),
    [handovers]
  )

  const completedHandovers = useMemo(
    () => handovers.filter(h => h.isCompleted),
    [handovers]
  )

  const displayList = tab === 'pending' ? pendingHandovers : completedHandovers

  const completedTasksWithEnergy = useMemo(
    () => tasks.filter(t => t.status === 'completed' && t.energyLevel),
    [tasks]
  )

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>交接中心 🤝</Text>
        <Text className={styles.subtitle}>完成治疗后按步骤交接</Text>
      </View>

      {completedTasksWithEnergy.length > 0 && (
        <View className={styles.energySection}>
          <Text className={styles.energyTitle}>⚡ 今日能量记录</Text>
          <View className={styles.energyGrid}>
            {completedTasksWithEnergy.map(task => (
              <View key={task.id} className={styles.energyItem}>
                <Text className={styles.energyEquipment}>{task.equipment}</Text>
                <Text className={styles.energyValue}>{task.energyLevel}</Text>
                <Text className={styles.energyCustomer}>{task.customerName}</Text>
              </View>
            ))}
          </View>
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
