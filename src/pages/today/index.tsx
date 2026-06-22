import React, { useMemo, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import TaskCard from '@/components/TaskCard';
import styles from './index.module.scss';

const TodayPage: React.FC = () => {
  const { tasks } = useAppStore()
  const [showDelayModal, setShowDelayModal] = useState(false)
  const [selectedDelayTaskId, setSelectedDelayTaskId] = useState<string | null>(null)

  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'pending'), [tasks])
  const inProgressTasks = useMemo(() => tasks.filter(t => t.status === 'in_progress'), [tasks])
  const overtimeTasks = useMemo(() => tasks.filter(t => t.status === 'overtime'), [tasks])
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks])

  const activeTasks = useMemo(
    () => [...overtimeTasks, ...inProgressTasks, ...pendingTasks],
    [overtimeTasks, inProgressTasks, pendingTasks]
  )

  const selectedDelayTask = useMemo(
    () => tasks.find(t => t.id === selectedDelayTaskId),
    [tasks, selectedDelayTaskId]
  )

  const handleTaskClick = (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (task?.status === 'overtime') {
      setSelectedDelayTaskId(id)
      setShowDelayModal(true)
    } else {
      Taro.navigateTo({ url: `/pages/taskDetail/index?id=${id}` })
    }
  }

  const handleAlertClick = () => {
    if (overtimeTasks.length === 1) {
      setSelectedDelayTaskId(overtimeTasks[0].id)
    } else {
      setSelectedDelayTaskId(null)
    }
    setShowDelayModal(true)
  }

  const displayTasks = selectedDelayTask ? [selectedDelayTask] : overtimeTasks

  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = `周${weekDays[today.getDay()]}`

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.greeting}>早安，治疗师 👋</Text>
        <Text className={styles.dateText}>{dateStr} {weekDay}</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{activeTasks.length}</Text>
            <Text className={styles.statLabel}>待完成</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{inProgressTasks.length}</Text>
            <Text className={styles.statLabel}>进行中</Text>
          </View>
          <View className={classnames(styles.statItem, overtimeTasks.length > 0 && styles.statOvertime)}>
            <Text className={styles.statValue}>{overtimeTasks.length}</Text>
            <Text className={styles.statLabel}>超时</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{completedTasks.length}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>
      </View>

      {overtimeTasks.length > 0 && (
        <View className={styles.overtimeAlert} onClick={handleAlertClick}>
          <Text className={styles.alertIcon}>⚠️</Text>
          <View className={styles.alertContent}>
            <Text className={styles.alertTitle}>{overtimeTasks.length}位顾客超时</Text>
            <Text className={styles.alertDesc}>点击查看延误原因与应对话术 →</Text>
          </View>
          <Text className={styles.alertArrow}>›</Text>
        </View>
      )}

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>今日任务</Text>
          <Text className={styles.sectionCount}>共{tasks.length}单</Text>
        </View>
      </View>

      <View className={styles.taskList}>
        {activeTasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
        ))}
      </View>

      {completedTasks.length > 0 && (
        <>
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>已完成</Text>
              <Text className={styles.sectionCount}>{completedTasks.length}单</Text>
            </View>
          </View>
          <View className={styles.taskList}>
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
            ))}
          </View>
        </>
      )}

      {showDelayModal && (
        <View className={styles.modalMask} onClick={() => setShowDelayModal(false)}>
          <View className={styles.modalPanel} onClick={e => e.stopPropagation?.()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalIcon}>🚨</Text>
              <Text className={styles.modalTitle}>门店提醒 · 超时处理</Text>
            </View>

            <View className={styles.delayList}>
              {displayTasks.map(task => (
                <View key={task.id} className={styles.delayCard}>
                  <View className={styles.delayCustomer}>
                    <Text className={styles.delayName}>{task.customerName} · {task.treatmentArea}</Text>
                    <View className={styles.delayBadge}>
                      <Text className={styles.delayBadgeText}>延误 {task.delayMinutes || 10} 分钟</Text>
                    </View>
                  </View>

                  <View className={styles.delaySection}>
                    <Text className={styles.delaySectionLabel}>📌 常见延误原因</Text>
                    <Text className={styles.delaySectionText}>
                      {task.delayReason || '顾客到店延迟/上一位操作超时/准备环节耗时较长'}
                    </Text>
                  </View>

                  <View className={styles.delaySection}>
                    <Text className={styles.delaySectionLabel}>💬 建议话术</Text>
                    <View className={styles.scriptBox}>
                      <Text className={styles.scriptText}>
                        {task.delayScript || '「非常抱歉让您久等了，刚才上一位顾客操作时临时加了一个部位，耽误了您的时间。我这边已经准备好了，马上为您开始治疗，今天会为您额外赠送一次护理面膜作为补偿，您看可以吗？」'}
                      </Text>
                    </View>
                  </View>

                  <View className={styles.delaySection}>
                    <Text className={styles.delaySectionLabel}>✅ 跟进动作</Text>
                    <Text className={styles.delaySectionText}>
                      1. 上前台确认顾客到店时间\n2. 同步门店店长，安排备用治疗室\n3. 安抚顾客情绪并提供补偿方案
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View className={styles.modalFooter}>
              <View
                className={styles.modalPrimaryBtn}
                onClick={() => {
                  setShowDelayModal(false)
                  Taro.switchTab({ url: '/pages/handover/index' })
                }}
              >
                <Text className={styles.modalPrimaryBtnText}>去交接中心处理</Text>
              </View>
              <View className={styles.modalCloseBtn} onClick={() => setShowDelayModal(false)}>
                <Text className={styles.modalCloseBtnText}>知道了</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default TodayPage
