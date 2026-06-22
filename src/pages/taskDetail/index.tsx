import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store/useAppStore';
import styles from './index.module.scss';

const statusLabelMap: Record<string, string> = {
  completed: '✅ 已完成',
  in_progress: '🔵 进行中',
  pending: '⚪ 待开始',
  overtime: '🔴 已超时'
}

const statusClassMap: Record<string, string> = {
  completed: styles.statusCompleted,
  in_progress: styles.statusInProgress,
  pending: styles.statusPending,
  overtime: styles.statusOvertime
}

const TaskDetailPage: React.FC = () => {
  const { tasks, updateTaskStatus } = useAppStore()

  const params = Taro.getCurrentInstance().router?.params
  const taskId = params?.id || ''

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId])

  if (!task) {
    return (
      <View className={styles.container}>
        <Text>任务不存在</Text>
      </View>
    )
  }

  const handleStart = () => {
    updateTaskStatus(task.id, 'in_progress')
    Taro.showToast({ title: '已开始治疗', icon: 'success' })
  }

  const handleComplete = () => {
    updateTaskStatus(task.id, 'completed')
    Taro.showToast({ title: '治疗已完成！+10积分', icon: 'success' })
  }

  return (
    <View className={styles.container}>
      <View className={classnames(styles.statusBanner, statusClassMap[task.status])}>
        <Text className={styles.statusText}>{statusLabelMap[task.status]}</Text>
        <Text className={styles.timeRange}>{task.startTime} - {task.endTime}</Text>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>顾客信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>姓名缩写</Text>
          <Text className={styles.infoValue}>{task.customerName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>治疗部位</Text>
          <Text className={styles.infoValue}>{task.treatmentArea}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>使用仪器</Text>
          <Text className={styles.infoValue}>{task.equipment}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>预计时长</Text>
          <Text className={styles.infoValue}>{task.estimatedTime}分钟</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>接手同事</Text>
          <Text className={styles.infoValue}>{task.nextColleague}</Text>
        </View>
      </View>

      <View className={styles.card}>
        <Text className={styles.cardTitle}>合规检查</Text>
        <View className={styles.checkRow}>
          <Text className={styles.checkLabel}>知情同意书</Text>
          <Text className={classnames(styles.checkStatus, task.consentSigned ? styles.checkYes : styles.checkNo)}>
            {task.consentSigned ? '已签署 ✓' : '未签署 ✗'}
          </Text>
        </View>
        {task.photoRequired && (
          <View className={styles.checkRow}>
            <Text className={styles.checkLabel}>拍照建档</Text>
            <Text className={classnames(styles.checkStatus, task.photoTaken ? styles.checkYes : styles.checkNo)}>
              {task.photoTaken ? '已拍照 ✓' : '未拍照 ✗'}
            </Text>
          </View>
        )}
      </View>

      {task.energyLevel && (
        <View className={styles.card}>
          <Text className={styles.cardTitle}>能量记录</Text>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>能量档位</Text>
            <Text className={styles.infoValue}>{task.energyLevel}</Text>
          </View>
        </View>
      )}

      <View className={styles.bottomBar}>
        {task.status === 'pending' && (
          <View className={styles.actionBtn} onClick={handleStart}>
            <Text className={styles.actionBtnText}>开始治疗</Text>
          </View>
        )}
        {task.status === 'in_progress' && (
          <>
            <View className={styles.actionBtnSecondary} onClick={() => Taro.navigateBack()}>
              <Text className={styles.actionBtnSecondaryText}>返回</Text>
            </View>
            <View className={styles.actionBtn} onClick={handleComplete}>
              <Text className={styles.actionBtnText}>完成治疗</Text>
            </View>
          </>
        )}
        {(task.status === 'completed' || task.status === 'overtime') && (
          <View className={styles.actionBtnSecondary} onClick={() => Taro.navigateBack()}>
            <Text className={styles.actionBtnSecondaryText}>返回</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default TaskDetailPage
