import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

type FilterType = 'all' | 'praise' | 'suggestion' | 'issue'

const categoryMap: Record<string, { label: string; className: string }> = {
  praise: { label: '👍 表扬', className: styles.categoryPraise },
  suggestion: { label: '💡 建议', className: styles.categorySuggestion },
  issue: { label: '⚠️ 问题', className: styles.categoryIssue }
}

const categoryList: { key: 'praise' | 'suggestion' | 'issue'; label: string; icon: string }[] = [
  { key: 'praise', label: '表扬', icon: '👍' },
  { key: 'suggestion', label: '建议', icon: '💡' },
  { key: 'issue', label: '问题', icon: '⚠️' }
]

const FeedbackPage: React.FC = () => {
  const { feedbacks, publishFeedback, likeFeedback } = useAppStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [inputText, setInputText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'praise' | 'suggestion' | 'issue'>('suggestion')
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)

  const filteredFeedbacks = useMemo(() => {
    if (filter === 'all') return feedbacks
    return feedbacks.filter(f => f.category === filter)
  }, [feedbacks, filter])

  const handleLike = (id: string, likedByMe: boolean) => {
    likeFeedback(id)
    if (!likedByMe) {
      Taro.vibrateShort?.({ type: 'light' })
    }
  }

  const handleCategoryPick = (cat: 'praise' | 'suggestion' | 'issue') => {
    setSelectedCategory(cat)
    setShowCategoryPicker(false)
  }

  const handleSend = () => {
    if (!inputText.trim()) {
      Taro.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    publishFeedback({ content: inputText.trim(), category: selectedCategory })
    Taro.showToast({ title: '发布成功！', icon: 'success' })
    setInputText('')
  }

  const currentCat = categoryList.find(c => c.key === selectedCategory)

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

      <ScrollView scrollY className={styles.list}>
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
                <View
                  className={classnames(styles.likeBtn, item.likedByMe && styles.likedBtn)}
                  onClick={() => handleLike(item.id, item.likedByMe)}
                >
                  <Text className={styles.likeIcon}>{item.likedByMe ? '❤️' : '👍'}</Text>
                  <Text className={styles.likeCount}>{item.likes}</Text>
                </View>
              </View>
            </View>
          )
        })}
        <View style={{ height: 40 }} />
      </ScrollView>

      <View className={styles.bottomBar}>
        <View
          className={styles.categoryBtn}
          onClick={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text className={styles.categoryBtnText}>{currentCat?.icon} {currentCat?.label}</Text>
        </View>
        {showCategoryPicker && (
          <View className={styles.pickerMask} onClick={() => setShowCategoryPicker(false)}>
            <View className={styles.pickerPanel} onClick={e => e.stopPropagation?.()}>
              {categoryList.map(cat => (
                <View
                  key={cat.key}
                  className={classnames(styles.pickerItem, selectedCategory === cat.key && styles.pickerItemActive)}
                  onClick={() => handleCategoryPick(cat.key)}
                >
                  <Text style={{ fontSize: '28rpx' }}>{cat.icon} {cat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <View className={styles.inputArea}>
          <Input
            className={styles.inputField}
            type="text"
            value={inputText}
            placeholder="说说你的想法..."
            onInput={(e) => setInputText(e.detail.value)}
            confirmType="send"
            onConfirm={handleSend}
          />
        </View>
        <View className={styles.sendBtn} onClick={handleSend}>
          <Text className={styles.sendBtnText}>发送</Text>
        </View>
      </View>
    </View>
  )
}

export default FeedbackPage
