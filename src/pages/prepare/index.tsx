import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import PrepItem from '@/components/PrepItem';
import styles from './index.module.scss';

type FilterType = 'all' | 'equipment' | 'disinfection' | 'material' | 'room'

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'equipment', label: '设备' },
  { key: 'disinfection', label: '消毒' },
  { key: 'material', label: '物料' },
  { key: 'room', label: '环境' }
]

const PreparePage: React.FC = () => {
  const { prepSteps, togglePrepStep } = useAppStore()
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredSteps = useMemo(() => {
    if (filter === 'all') return prepSteps
    return prepSteps.filter(s => s.category === filter)
  }, [prepSteps, filter])

  const completedCount = prepSteps.filter(s => s.completed).length
  const totalCount = prepSteps.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const allDone = completedCount === totalCount

  const handleSubmit = () => {
    if (!allDone) {
      Taro.showToast({ title: '请完成所有准备步骤', icon: 'none' })
      return
    }
    Taro.showToast({ title: '准备确认提交成功！+20积分', icon: 'success' })
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>术前准备</Text>
        <Text className={styles.subtitle}>开工前确认所有准备工作</Text>
      </View>

      <View className={styles.progressSection}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>完成进度</Text>
          <Text className={styles.progressPercent}>{progressPercent}%</Text>
        </View>
        <View className={styles.progressBar}>
          <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </View>
        <View className={styles.progressStats}>
          <Text className={styles.progressStat}>已完成 {completedCount} 项</Text>
          <Text className={styles.progressStat}>共 {totalCount} 项</Text>
        </View>
      </View>

      <View className={styles.filterRow}>
        {filterOptions.map(opt => (
          <View
            key={opt.key}
            className={classnames(styles.filterBtn, filter === opt.key && styles.filterActive)}
            onClick={() => setFilter(opt.key)}
          >
            <Text style={{ color: filter === opt.key ? '#fff' : undefined, fontSize: '24rpx' }}>{opt.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.stepList}>
        {filteredSteps.map(step => (
          <PrepItem key={step.id} step={step} onToggle={togglePrepStep} />
        ))}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.bottomInfo}>
          <Text className={styles.bottomLabel}>准备进度</Text>
          <Text className={styles.bottomValue}>{completedCount}/{totalCount}</Text>
        </View>
        <View
          className={classnames(styles.submitBtn, !allDone && styles.submitDisabled)}
          onClick={handleSubmit}
        >
          <Text className={styles.submitBtnText}>{allDone ? '确认提交' : '未完成'}</Text>
        </View>
      </View>
    </View>
  )
}

export default PreparePage
