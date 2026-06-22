import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { SwapRequest } from '@/types';
import styles from './index.module.scss';

interface SwapCardProps {
  swap: SwapRequest;
  onClick?: (id: string) => void;
}

const statusMap: Record<SwapRequest['status'], { label: string; className: string }> = {
  open: { label: '待接单', className: styles.statusOpen },
  taken: { label: '已接单', className: styles.statusTaken },
  expired: { label: '已过期', className: styles.statusExpired }
}

const SwapCard: React.FC<SwapCardProps> = ({ swap, onClick }) => {
  const statusInfo = statusMap[swap.status]

  return (
    <View className={styles.card} onClick={() => onClick?.(swap.id)}>
      <View className={styles.cardHeader}>
        <View className={styles.userInfo}>
          <Image className={styles.avatar} src={swap.requesterAvatar} mode="aspectFill" />
          <Text className={styles.name}>{swap.requesterName}</Text>
        </View>
        <View className={classnames(styles.statusBadge, statusInfo.className)}>
          {statusInfo.label}
        </View>
      </View>
      <View className={styles.cardBody}>
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
      </View>
      <View className={styles.cardFooter}>
        <Text className={styles.reason}>{swap.reason}</Text>
        {swap.status === 'open' && (
          <View className={styles.pointsTag}>
            <Text className={styles.pointsText}>+{swap.points}积分</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default SwapCard
