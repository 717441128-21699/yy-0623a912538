import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, Image, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

type FilterType = 'all' | 'praise' | 'suggestion' | 'issue'
type StatusFilterType = 'all' | 'unhandled' | 'followed' | 'processing' | 'resolved'

const categoryMap: Record<string, { label: string; className: string }> = {
  praise: { label: '👍 表扬', className: styles.categoryPraise },
  suggestion: { label: '💡 建议', className: styles.categorySuggestion },
  issue: { label: '⚠️ 问题', className: styles.categoryIssue }
}

const statusMap: Record<string, { label: string; className: string; nextLabel: string; next: string }> = {
  unhandled: { label: '待跟进', className: styles.statusUnhandled, nextLabel: '标记已跟进', next: 'followed' },
  followed: { label: '已跟进', className: styles.statusFollowed, nextLabel: '标处理中', next: 'processing' },
  processing: { label: '处理中', className: styles.statusProcessing, nextLabel: '标已解决', next: 'resolved' },
  resolved: { label: '已解决', className: styles.statusResolved, nextLabel: '', next: '' }
}

const categoryList: { key: 'praise' | 'suggestion' | 'issue'; label: string; icon: string }[] = [
  { key: 'praise', label: '表扬', icon: '👍' },
  { key: 'suggestion', label: '建议', icon: '💡' },
  { key: 'issue', label: '问题', icon: '⚠️' }
]

const FeedbackPage: React.FC = () => {
  const { feedbacks, publishFeedback, likeFeedback, updateFeedbackStatus } = useAppStore()
  const [filter, setFilter] = useState<FilterType>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all')
  const [inputText, setInputText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'praise' | 'suggestion' | 'issue'>('suggestion')
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const scrollViewRef = useRef<any>(null)

  const params = Taro.getCurrentInstance().router?.params
  const highlightParam = params?.highlight || ''

  useEffect(() => {
    if (highlightParam) {
      setHighlightId(highlightParam)
      const timer = setTimeout(() => setHighlightId(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [highlightParam])

  const filteredFeedbacks = useMemo(() => {
    let result = feedbacks
    if (filter !== 'all') {
      result = result.filter(f => f.category === filter)
    }
    if (statusFilter !== 'all') {
      result = result.filter(f => f.followUpStatus === statusFilter)
    }
    return result
  }, [feedbacks, filter, statusFilter])

  const handleLike = (id: string, likedByMe: boolean) => {
    likeFeedback(id)
    if (!likedByMe) {
      Taro.vibrateShort?.({ type: 'light' })
    }
  }

  const handleStatusChange = (id: string, currentStatus: string) => {
    const info = statusMap[currentStatus]
    if (!info || !info.next) return
    updateFeedbackStatus(id, info.next as any)
    Taro.showToast({ title: info.nextLabel, icon: 'success', duration: 1000 })
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
            onClick={() => { setFilter(opt.key as FilterType); setStatusFilter('all') }}
          >
            <Text style={{ color: filter === opt.key ? '#fff' : undefined, fontSize: '24rpx' }}>{opt.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.statusFilterRow}>
        {[
          { key: 'all', label: '全部状态' },
          { key: 'unhandled', label: '待跟进' },
          { key: 'followed', label: '已跟进' },
          { key: 'processing', label: '处理中' },
          { key: 'resolved', label: '已解决' }
        ].map(opt => (
          <View
            key={opt.key}
            className={classnames(styles.statusBtn, statusFilter === opt.key && styles.statusBtnActive)}
            onClick={() => setStatusFilter(opt.key as StatusFilterType)}
          >
            <Text style={{ color: statusFilter === opt.key ? '#00C9A7' : undefined, fontSize: '22rpx' }}>{opt.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView scrollY className={styles.list} scrollIntoView={highlightId || ''} scrollWithAnimation>
        {filteredFeedbacks.map(item => {
          const catInfo = categoryMap[item.category]
          const statusInfo = statusMap[item.followUpStatus]
          return (
            <View
              key={item.id}
              id={item.id}
              className={classnames(styles.feedbackCard, highlightId === item.id && styles.feedbackCardHighlight)}
            >
              <View className={styles.feedbackHeader}>
                <Image className={styles.feedbackAvatar} src={item.authorAvatar} mode="aspectFill" />
                <Text className={styles.feedbackAuthor}>{item.authorName}</Text>
                <View className={classnames(styles.categoryTag, catInfo.className)}>
                  <Text style={{ fontSize: '22rpx' }}>{catInfo.label}</Text>
                </View>
                <View className={classnames(styles.followUpTag, statusInfo.className)}>
                  <Text style={{ fontSize: '20rpx' }}>{statusInfo.label}</Text>
                </View>
              </View>
              <Text className={styles.feedbackContent}>{item.content}</Text>
              <View className={styles.feedbackFooter}>
                <View className={styles.footerLeft}>
                  <Text className={styles.feedbackTime}>{item.createdAt}</Text>
                  {statusInfo.next && (
                    <View
                      className={styles.statusActionBtn}
                      onClick={() => handleStatusChange(item.id, item.followUpStatus)}
                    >
                      <Text style={{ fontSize: '22rpx' }}>{statusInfo.nextLabel} →</Text>
                    </View>
                  )}
                </View>
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
