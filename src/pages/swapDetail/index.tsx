import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const SwapDetailPage: React.FC = () => {
  const { swaps, takeSwap } = useAppStore()

  const params = Taro.getCurrentInstance().router?.params
  const swapId = params?.id || ''

  const swap = useMemo(() => swaps.find(s => s.id === swapId), [swaps, swapId])

  if (!swap) {
    return (
      <View className={styles.container}>
        <Text>换班请求不存在</Text>
      </View>
    )
  }

  const handleAccept = () => {
    const success = takeSwap(swap.id, '小李')
    if (success) {
      Taro.showToast({ title: `接单成功！+${swap.points}积分`, icon: 'success' })
    } else {
      Taro.showToast({ title: '此换班已被接走啦', icon: 'none' })
    }
    setTimeout(() => Taro.navigateBack(), 1500)
  }

  return (
    <View className={styles.container}>
      <View className={styles.card}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={swap.requesterAvatar} mode="aspectFill" />
          <View className={styles.nameSection}>
            <Text className={styles.name}>{swap.requesterName}</Text>
            <Text className={styles.createdAt}>发布于 {swap.createdAt}</Text>
          </View>
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>换班详情</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>📅 日期</Text>
          <Text className={styles.infoValue}>{swap.shiftDate}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>🕐 时间</Text>
          <Text className={styles.infoValue}>{swap.shiftTime}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>🔬 仪器</Text>
          <Text className={styles.infoValue}>{swap.equipment}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>📋 状态</Text>
          <Text className={styles.infoValue}>
            {swap.status === 'open' ? '待接单' : swap.status === 'taken' ? '已接单' : '已过期'}
          </Text>
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>换班原因</Text>
        <Text className={styles.reasonText}>{swap.reason}</Text>
        {swap.status === 'open' && (
          <View className={styles.pointsBanner}>
            <Text className={styles.pointsText}>接单奖励 +{swap.points}积分</Text>
          </View>
        )}
        {swap.status === 'taken' && swap.takerName && (
          <View className={styles.takerInfo}>
            <Text className={styles.takerLabel}>已由</Text>
            <Text className={styles.takerName}>{swap.takerName}</Text>
            <Text className={styles.takerLabel}>接单</Text>
          </View>
        )}
      </View>

      {swap.status === 'open' && (
        <View className={styles.bottomBar}>
          <View className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
            <Text className={styles.cancelBtnText}>返回</Text>
          </View>
          <View className={styles.acceptBtn} onClick={handleAccept}>
            <Text className={styles.acceptBtnText}>我来接单</Text>
          </View>
        </View>
      )}
    </View>
  )
}

export default SwapDetailPage
