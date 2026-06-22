import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { RankItem as RankItemType } from '@/types';
import styles from './index.module.scss';

interface RankItemProps {
  item: RankItemType;
  isMe?: boolean;
}

const RankItem: React.FC<RankItemProps> = ({ item, isMe }) => {
  const rankIcon = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : ''

  return (
    <View className={classnames(styles.item, isMe && styles.isMe)}>
      <View className={styles.rankArea}>
        {rankIcon ? (
          <Text className={styles.rankIcon}>{rankIcon}</Text>
        ) : (
          <View className={styles.rankNumber}>
            <Text className={styles.rankText}>{item.rank}</Text>
          </View>
        )}
      </View>
      <Image className={styles.avatar} src={item.avatar} mode="aspectFill" />
      <View className={styles.info}>
        <Text className={styles.name}>{item.name}{isMe ? ' (我)' : ''}</Text>
        <Text className={styles.stats}>完成{item.completedTasks}单 · 完美交接{item.perfectHandovers}次</Text>
      </View>
      <View className={styles.pointsArea}>
        <Text className={styles.points}>{item.points}</Text>
        <Text className={styles.pointsLabel}>积分</Text>
      </View>
    </View>
  )
}

export default RankItem
