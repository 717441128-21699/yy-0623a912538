import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { HandoverItem } from '@/types';
import styles from './index.module.scss';

interface HandoverCardProps {
  item: HandoverItem;
  onStepToggle: (handoverId: string, stepId: string) => void;
}

const stepIconMap: Record<string, string> = {
  clean: '🧹',
  cool: '❄️',
  energy: '⚡',
  handover: '🤝'
}

const HandoverCard: React.FC<HandoverCardProps> = ({ item, onStepToggle }) => {
  const completedCount = item.steps.filter(s => s.completed).length
  const totalSteps = item.steps.length

  return (
    <View className={styles.card}>
      <View className={styles.cardHeader}>
        <View className={styles.customerName}>{item.customerName}</View>
        <View className={styles.progress}>
          <Text className={styles.progressText}>{completedCount}/{totalSteps}</Text>
        </View>
      </View>

      {item.delayMinutes > 0 && (
        <View className={styles.delayBanner}>
          <Text className={styles.delayIcon}>⏰</Text>
          <View className={styles.delayContent}>
            <Text className={styles.delayTitle}>超时{item.delayMinutes}分钟</Text>
            <Text className={styles.delayReason}>{item.delayReason}</Text>
          </View>
        </View>
      )}

      {item.delayMinutes > 0 && item.delayScript && (
        <View className={styles.scriptBox}>
          <Text className={styles.scriptLabel}>💡 建议话术</Text>
          <Text className={styles.scriptText}>{item.delayScript}</Text>
        </View>
      )}

      <View className={styles.steps}>
        {item.steps.map((step) => (
          <View
            key={step.id}
            className={classnames(styles.step, step.completed && styles.stepDone)}
            onClick={() => onStepToggle(item.id, step.id)}
          >
            <View className={classnames(styles.stepCheck, step.completed && styles.stepCheckDone)}>
              {step.completed && <Text className={styles.stepCheckMark}>✓</Text>}
            </View>
            <Text className={styles.stepIcon}>{stepIconMap[step.type]}</Text>
            <Text className={styles.stepTitle}>{step.title}</Text>
          </View>
        ))}
      </View>

      {item.isCompleted && (
        <View className={styles.completedBanner}>
          <Text className={styles.completedIcon}>🎉</Text>
          <Text className={styles.completedText}>交接完成！+10积分</Text>
        </View>
      )}
    </View>
  )
}

export default HandoverCard
