import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { mockFeedbacks } from '@/data/rankings';
import styles from './index.module.scss';

type FilterType = 'all' | 'praise' | 'suggestion' | 'issue'

const categoryMap: Record<string, { label: string; className: string }> = {
  praise: { label: '👍 表扬', className: styles.categoryPraise },
  suggestion: { label: '💡 建议', className: styles.categorySuggestion },
  issue: { label: '⚠️ 问题', className: styles.categoryIssue }
}

const FeedbackPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredFeedbacks = useMemo(() => {
    if (filter === 'all') return mockFeedbacks
    return mockFeedbacks.filter(f => f.category === filter)
  }, [filter])

  const handleSend = () => {
    Taro.showToast({ title: '发布功能开发中', icon: 'none' })
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>反馈墙 📢</Text>
        <Text className={styles.subtitle}>让团队声音被听见</Text>
      </View>

      <View className={styles.filterRow}>
        {[
          { key: 'all', label: '全部' },
          { key: 'praise', label: '表扬' },
          { key: 'suggestion', label: '建议' },
          { key: 'issue', label: '问题' }
        ].map(opt => (
          <View
            key={opt.key}
            className={classnames(styles.filterBtn, filter === opt.key && styles.filterActive)}
            onClick={() => setFilter(opt.key as FilterType)}
          >
            <Text style={{ color: filter === opt.key ? '#fff' : undefined, fontSize: '24rpx' }}>{opt.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.list}>
        {filteredFeedbacks.map(item => {
          const catInfo = categoryMap[item.category]
          return (
            <View key={item.id} className={styles.feedbackCard}>
              <View className={styles.feedbackHeader}>
                <Image className={styles.feedbackAvatar} src={item.authorAvatar} mode="aspectFill" />
                <Text className={styles.feedbackAuthor}>{item.authorName}</Text>
                <View className={classnames(styles.categoryTag, catInfo.className)}>
                  <Text style={{ fontSize: '22rpx' }}>{catInfo.label}</Text>
                </View>
              </View>
              <Text className={styles.feedbackContent}>{item.content}</Text>
              <View className={styles.feedbackFooter}>
                <Text className={styles.feedbackTime}>{item.createdAt}</Text>
                <View className={styles.likeBtn}>
                  <Text className={styles.likeIcon}>👍</Text>
                  <Text className={styles.likeCount}>{item.likes}</Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.inputArea}>
          <Text className={styles.inputPlaceholder}>说说你的想法...</Text>
        </View>
        <View className={styles.sendBtn} onClick={handleSend}>
          <Text className={styles.sendBtnText}>发送</Text>
        </View>
      </View>
    </View>
  )
}

export default FeedbackPage
