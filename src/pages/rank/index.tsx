import React, { useState, useMemo } from 'react';
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

const categoryIconMap: Record<string, string> = {
  praise: '👍',
  suggestion: '💡',
  issue: '⚠️'
}

const statusLabelMap: Record<string, string> = {
  unhandled: '待跟进',
  followed: '已跟进',
  processing: '处理中',
  resolved: '已解决'
}

const RankPage: React.FC = () => {
  const { myPoints, rankings, feedbacks } = useAppStore()
  const [tab, setTab] = useState<TabType>('rank')

  const recentFeedbacks = useMemo(
    () => feedbacks.slice(0, 3),
    [feedbacks]
  )

  const handleFeedback = (highlightId?: string) => {
    const url = highlightId
      ? `/pages/feedback/index?highlight=${highlightId}`
      : '/pages/feedback/index'
    Taro.navigateTo({ url })
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
        <View className={styles.myPointsRight} onClick={() => handleFeedback()}>
          <Text className={styles.myPointsBtnText}>反馈墙</Text>
        </View>
      </View>

      {recentFeedbacks.length > 0 && (
        <View className={styles.feedbackSummary}>
          <View className={styles.summaryHeader}>
            <Text className={styles.summaryTitle}>📢 最近团队反馈</Text>
            <View className={styles.summaryMore} onClick={() => handleFeedback()}>
              <Text style={{ fontSize: '24rpx', color: '#00C9A7' }}>查看全部 →</Text>
            </View>
          </View>
          {recentFeedbacks.map(item => (
            <View
              key={item.id}
              className={styles.summaryItem}
              onClick={() => handleFeedback(item.id)}
            >
              <View className={styles.summaryItemLeft}>
                <Text className={styles.summaryIcon}>{categoryIconMap[item.category]}</Text>
                <View className={styles.summaryItemContent}>
                  <Text className={styles.summaryItemText}>{item.content.length > 28 ? item.content.slice(0, 28) + '…' : item.content}</Text>
                  <Text className={styles.summaryItemMeta}>{item.authorName} · {statusLabelMap[item.followUpStatus]}</Text>
                </View>
              </View>
              <Text className={styles.summaryArrow}>›</Text>
            </View>
          ))}
        </View>
      )}

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
