import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { TaskItem } from '@/types';
import styles from './index.module.scss';

interface TaskCardProps {
  task: TaskItem;
  onClick?: (id: string) => void;
}

const statusMap: Record<TaskItem['status'], { label: string; className: string }> = {
  completed: { label: '已完成', className: styles.statusCompleted },
  in_progress: { label: '进行中', className: styles.statusInProgress },
  pending: { label: '待开始', className: styles.statusPending },
  overtime: { label: '已超时', className: styles.statusOvertime }
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const statusInfo = statusMap[task.status]

  return (
    <View className={styles.card} onClick={() => onClick?.(task.id)}>
      <View className={styles.cardHeader}>
        <View className={styles.equipmentTag}>{task.equipment}</View>
        <View className={classnames(styles.statusBadge, statusInfo.className)}>
          {statusInfo.label}
        </View>
      </View>
      <View className={styles.cardBody}>
        <View className={styles.customerInfo}>
          <Text className={styles.customerName}>{task.customerName}</Text>
          <Text className={styles.treatmentArea}>{task.treatmentArea}</Text>
        </View>
        <View className={styles.timeInfo}>
          <Text className={styles.time}>{task.startTime} - {task.endTime}</Text>
          <Text className={styles.duration}>约{task.estimatedTime}分钟</Text>
        </View>
      </View>
      <View className={styles.cardFooter}>
        <View className={styles.checkItems}>
          <View className={classnames(styles.checkItem, task.consentSigned && styles.checked)}>
            <Text className={styles.checkIcon}>{task.consentSigned ? '✓' : '○'}</Text>
            <Text className={styles.checkLabel}>知情同意</Text>
          </View>
          {task.photoRequired && (
            <View className={classnames(styles.checkItem, task.photoTaken && styles.checked)}>
              <Text className={styles.checkIcon}>{task.photoTaken ? '✓' : '○'}</Text>
              <Text className={styles.checkLabel}>拍照建档</Text>
            </View>
          )}
        </View>
        <View className={styles.nextColleague}>
          <Text className={styles.nextLabel}>接手</Text>
          <Text className={styles.nextName}>{task.nextColleague}</Text>
        </View>
      </View>
    </View>
  )
}

export default TaskCard
