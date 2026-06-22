import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import TaskCard from '@/components/TaskCard';
import styles from './index.module.scss';

const TodayPage: React.FC = () => {
  const { tasks } = useAppStore()

  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'pending'), [tasks])
  const inProgressTasks = useMemo(() => tasks.filter(t => t.status === 'in_progress'), [tasks])
  const overtimeTasks = useMemo(() => tasks.filter(t => t.status === 'overtime'), [tasks])
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks])

  const activeTasks = useMemo(
    () => [...overtimeTasks, ...inProgressTasks, ...pendingTasks],
    [overtimeTasks, inProgressTasks, pendingTasks]
  )

  const handleTaskClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/taskDetail/index?id=${id}` })
  }

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
          <View className={styles.statItem}>
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
        <View className={styles.overtimeAlert}>
          <Text className={styles.alertIcon}>⚠️</Text>
          <View className={styles.alertContent}>
            <Text className={styles.alertTitle}>{overtimeTasks.length}位顾客超时</Text>
            <Text className={styles.alertDesc}>请查看交接中心的延误话术</Text>
          </View>
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
    </View>
  )
}

export default TodayPage
