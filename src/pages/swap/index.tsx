import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import SwapCard from '@/components/SwapCard';
import styles from './index.module.scss';

type TabType = 'open' | 'taken' | 'expired'

const equipmentOptions = ['热玛吉FLX', '超声刀', '光子嫩肤', '冷冻溶脂', '点阵激光', '半导体激光']
const timeOptions = ['08:00-12:00', '09:00-12:00', '13:00-18:00', '14:00-18:00', '09:00-18:00', '16:00-20:00']
const pointsOptions = [10, 20, 25, 30, 35, 50]

const SwapPage: React.FC = () => {
  const { swaps, publishSwap } = useAppStore()
  const [tab, setTab] = useState<TabType>('open')
  const [showPublish, setShowPublish] = useState(false)
  const [formData, setFormData] = useState({
    shiftDate: '',
    shiftTime: '',
    equipment: '',
    reason: '',
    points: 20
  })

  const filteredSwaps = useMemo(() => {
    if (tab === 'open') return swaps.filter(s => s.status === 'open')
    if (tab === 'taken') return swaps.filter(s => s.status === 'taken')
    return swaps.filter(s => s.status === 'expired')
  }, [swaps, tab])

  const handleSwapClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/swapDetail/index?id=${id}` })
  }

  const handlePublish = () => {
    setShowPublish(true)
  }

  const handleCancel = () => {
    setShowPublish(false)
    setFormData({ shiftDate: '', shiftTime: '', equipment: '', reason: '', points: 20 })
  }

  const handleSubmit = () => {
    if (!formData.shiftDate) {
      Taro.showToast({ title: '请选择换班日期', icon: 'none' })
      return
    }
    if (!formData.shiftTime) {
      Taro.showToast({ title: '请选择时段', icon: 'none' })
      return
    }
    if (!formData.equipment) {
      Taro.showToast({ title: '请选择仪器', icon: 'none' })
      return
    }
    if (!formData.reason.trim()) {
      Taro.showToast({ title: '请填写换班原因', icon: 'none' })
      return
    }
    publishSwap(formData)
    Taro.showToast({ title: '换班已发布！', icon: 'success' })
    setShowPublish(false)
    setFormData({ shiftDate: '', shiftTime: '', equipment: '', reason: '', points: 20 })
    setTab('open')
  }

  if (showPublish) {
    return (
      <View className={styles.container}>
        <View className={styles.header}>
          <Text className={styles.title}>发布换班 🔄</Text>
          <Text className={styles.subtitle}>填写信息，寻找代班伙伴</Text>
        </View>

        <ScrollView scrollY className={styles.formWrap}>
          <View className={styles.formCard}>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>📅 换班日期</Text>
              <Input
                className={styles.formInput}
                type="text"
                value={formData.shiftDate}
                placeholder="例如: 2026-06-25"
                onInput={(e) => setFormData({ ...formData, shiftDate: e.detail.value })}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>🕐 时段</Text>
              <View className={styles.optionRow}>
                {timeOptions.map(opt => (
                  <View
                    key={opt}
                    className={classnames(styles.optionTag, formData.shiftTime === opt && styles.optionActive)}
                    onClick={() => setFormData({ ...formData, shiftTime: opt })}
                  >
                    <Text style={{ color: formData.shiftTime === opt ? '#fff' : undefined, fontSize: '24rpx' }}>{opt}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>🔬 仪器</Text>
              <View className={styles.optionRow}>
                {equipmentOptions.map(opt => (
                  <View
                    key={opt}
                    className={classnames(styles.optionTag, formData.equipment === opt && styles.optionActive)}
                    onClick={() => setFormData({ ...formData, equipment: opt })}
                  >
                    <Text style={{ color: formData.equipment === opt ? '#fff' : undefined, fontSize: '24rpx' }}>{opt}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>📝 换班原因</Text>
              <Input
                className={styles.formInput}
                type="text"
                value={formData.reason}
                placeholder="请简要说明换班原因"
                onInput={(e) => setFormData({ ...formData, reason: e.detail.value })}
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>⭐ 奖励积分</Text>
              <View className={styles.optionRow}>
                {pointsOptions.map(opt => (
                  <View
                    key={opt}
                    className={classnames(styles.optionTag, formData.points === opt && styles.optionActive)}
                    onClick={() => setFormData({ ...formData, points: opt })}
                  >
                    <Text style={{ color: formData.points === opt ? '#fff' : undefined, fontSize: '24rpx' }}>+{opt}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View className={styles.formBottom}>
          <View className={styles.formBtnCancel} onClick={handleCancel}>
            <Text className={styles.formBtnCancelText}>取消</Text>
          </View>
          <View className={styles.formBtnSubmit} onClick={handleSubmit}>
            <Text className={styles.formBtnSubmitText}>发布换班</Text>
          </View>
        </View>
      </View>
    )
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
