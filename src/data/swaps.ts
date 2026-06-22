import { SwapRequest } from '@/types'

export const mockSwaps: SwapRequest[] = [
  {
    id: 's1',
    requesterName: '小李',
    requesterAvatar: 'https://picsum.photos/id/64/200/200',
    shiftDate: '2026-06-23',
    shiftTime: '09:00-12:00',
    equipment: '热玛吉FLX',
    reason: '家中有事需要请假半天',
    status: 'open',
    createdAt: '2026-06-22 08:30',
    points: 30
  },
  {
    id: 's2',
    requesterName: '小周',
    requesterAvatar: 'https://picsum.photos/id/91/200/200',
    shiftDate: '2026-06-24',
    shiftTime: '14:00-18:00',
    equipment: '超声刀',
    reason: '要去医院复查',
    status: 'open',
    createdAt: '2026-06-22 10:15',
    points: 25
  },
  {
    id: 's3',
    requesterName: '小陈',
    requesterAvatar: 'https://picsum.photos/id/177/200/200',
    shiftDate: '2026-06-25',
    shiftTime: '09:00-18:00',
    equipment: '光子嫩肤',
    reason: '朋友婚礼',
    status: 'taken',
    takerName: '小李',
    createdAt: '2026-06-21 16:00',
    points: 50
  },
  {
    id: 's4',
    requesterName: '小周',
    requesterAvatar: 'https://picsum.photos/id/91/200/200',
    shiftDate: '2026-06-20',
    shiftTime: '09:00-12:00',
    equipment: '冷冻溶脂',
    reason: '身体不适',
    status: 'expired',
    createdAt: '2026-06-19 20:00',
    points: 30
  },
  {
    id: 's5',
    requesterName: '小李',
    requesterAvatar: 'https://picsum.photos/id/64/200/200',
    shiftDate: '2026-06-26',
    shiftTime: '13:00-17:00',
    equipment: '点阵激光',
    reason: '参加培训课程',
    status: 'open',
    createdAt: '2026-06-22 14:00',
    points: 35
  },
  {
    id: 's6',
    requesterName: '小陈',
    requesterAvatar: 'https://picsum.photos/id/177/200/200',
    shiftDate: '2026-06-27',
    shiftTime: '09:00-13:00',
    equipment: '半导体激光',
    reason: '驾照考试',
    status: 'open',
    createdAt: '2026-06-22 11:00',
    points: 20
  }
]
