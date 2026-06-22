import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import { PrepStep } from '@/types';
import styles from './index.module.scss';

interface PrepItemProps {
  step: PrepStep;
  onToggle: (id: string) => void;
}

const categoryIconMap: Record<PrepStep['category'], string> = {
  equipment: '⚙️',
  disinfection: '🧴',
  material: '📦',
  room: '🏠'
}

const categoryLabelMap: Record<PrepStep['category'], string> = {
  equipment: '设备',
  disinfection: '消毒',
  material: '物料',
  room: '环境'
}

const PrepItem: React.FC<PrepItemProps> = ({ step, onToggle }) => {
  return (
    <View
      className={classnames(styles.item, step.completed && styles.completed)}
      onClick={() => onToggle(step.id)}
    >
      <View className={styles.checkCircle}>
        {step.completed ? <Text className={styles.checkMark}>✓</Text> : null}
      </View>
      <View className={styles.content}>
        <View className={styles.titleRow}>
          <Text className={styles.categoryTag}>{categoryIconMap[step.category]} {categoryLabelMap[step.category]}</Text>
          <Text className={styles.title}>{step.title}</Text>
        </View>
        <Text className={styles.description}>{step.description}</Text>
      </View>
    </View>
  )
}

export default PrepItem
