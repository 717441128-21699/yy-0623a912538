import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import { mockLearningReminders } from '@/data/rankings';
import RankItem from '@/components/RankItem';
import styles from './index.module.scss';

type TabType = 'rank' | 'learning'

const typeIconMap: Record<string, string> = {
  video: '🎬',
  article: '📖',
  quiz: '📝'
}

const RankPage: React.FC = () => {
  const { myPoints, rankings } = useAppStore()
  const [tab, setTab] = useState<TabType>('rank')

  const handleFeedback = () => {
    Taro.navigateTo({ url: '/pages/feedback/index' })
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>积分榜 🏆</Text>
        <Text className={styles.subtitle}>完成越规范，积分越高</Text>
      </View>

      <View className={styles.myPoints}>
        <View className={styles.myPointsLeft}>
          <Text className={styles.myPointsLabel}>我的积分</Text>
          <Text className={styles.myPointsValue}>{myPoints}</Text>
        </View>
        <View className={styles.myPointsRight} onClick={handleFeedback}>
          <Text className={styles.myPointsBtnText}>反馈墙</Text>
        </View>
      </View>

      <View className={styles.tabRow}>
        <View
          className={classnames(styles.tab, tab === 'rank' && styles.tabActive)}
          onClick={() => setTab('rank')}
        >
          <Text className={styles.tabText}>排行榜</Text>
        </View>
        <View
          className={classnames(styles.tab, tab === 'learning' && styles.tabActive)}
          onClick={() => setTab('learning')}
        >
          <Text className={styles.tabText}>学习提醒</Text>
        </View>
      </View>

      {tab === 'rank' && (
        <View className={styles.rankList}>
          {rankings.map(item => (
            <RankItem key={item.id} item={item} isMe={item.name === '小李'} />
          ))}
        </View>
      )}

      {tab === 'learning' && (
        <View className={styles.learningSection}>
          <Text className={styles.sectionTitle}>📚 待完成学习</Text>
          {mockLearningReminders.map(item => (
            <View key={item.id} className={classnames(styles.learningItem, item.completed && styles.learningDone)}>
              <Text className={styles.learningIcon}>{typeIconMap[item.type]}</Text>
              <View className={styles.learningInfo}>
                <Text className={styles.learningTitle}>{item.title}</Text>
                <Text className={styles.learningMeta}>截止：{item.deadline}</Text>
              </View>
              <Text className={styles.learningPoints}>+{item.points}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default RankPage
