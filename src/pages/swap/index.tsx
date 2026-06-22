import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import SwapCard from '@/components/SwapCard';
import styles from './index.module.scss';

type TabType = 'open' | 'taken' | 'expired'

const SwapPage: React.FC = () => {
  const { swaps } = useAppStore()
  const [tab, setTab] = useState<TabType>('open')

  const filteredSwaps = useMemo(() => {
    if (tab === 'open') return swaps.filter(s => s.status === 'open')
    if (tab === 'taken') return swaps.filter(s => s.status === 'taken')
    return swaps.filter(s => s.status === 'expired')
  }, [swaps, tab])

  const handleSwapClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/swapDetail/index?id=${id}` })
  }

  const handlePublish = () => {
    Taro.showToast({ title: '换班发布功能开发中', icon: 'none' })
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>换班广场 🔄</Text>
        <Text className={styles.subtitle}>临时换班，互帮互助</Text>
      </View>

      <View className={styles.tabRow}>
        <View
          className={classnames(styles.tab, tab === 'open' && styles.tabActive)}
          onClick={() => setTab('open')}
        >
          <Text className={styles.tabText}>待接单 ({swaps.filter(s => s.status === 'open').length})</Text>
        </View>
        <View
          className={classnames(styles.tab, tab === 'taken' && styles.tabActive)}
          onClick={() => setTab('taken')}
        >
          <Text className={styles.tabText}>已接单</Text>
        </View>
        <View
          className={classnames(styles.tab, tab === 'expired' && styles.tabActive)}
          onClick={() => setTab('expired')}
        >
          <Text className={styles.tabText}>已过期</Text>
        </View>
      </View>

      <View className={styles.list}>
        {filteredSwaps.map(swap => (
          <SwapCard key={swap.id} swap={swap} onClick={handleSwapClick} />
        ))}
        {filteredSwaps.length === 0 && (
          <Text className={styles.emptyTip}>暂无换班请求</Text>
        )}
      </View>

      <View className={styles.publishBtn} onClick={handlePublish}>
        <Text className={styles.publishBtnText}>发布换班</Text>
      </View>
    </View>
  )
}

export default SwapPage
