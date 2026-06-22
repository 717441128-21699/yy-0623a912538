import { RankItem, FeedbackItem, LearningReminder } from '@/types'

export const mockRankings: RankItem[] = [
  { id: 'r1', name: '小周', avatar: 'https://picsum.photos/id/91/200/200', points: 2680, completedTasks: 142, perfectHandovers: 128, rank: 1 },
  { id: 'r2', name: '小李', avatar: 'https://picsum.photos/id/64/200/200', points: 2450, completedTasks: 130, perfectHandovers: 115, rank: 2 },
  { id: 'r3', name: '小陈', avatar: 'https://picsum.photos/id/177/200/200', points: 2320, completedTasks: 125, perfectHandovers: 108, rank: 3 },
  { id: 'r4', name: '小王', avatar: 'https://picsum.photos/id/338/200/200', points: 2100, completedTasks: 118, perfectHandovers: 95, rank: 4 },
  { id: 'r5', name: '小张', avatar: 'https://picsum.photos/id/1027/200/200', points: 1950, completedTasks: 110, perfectHandovers: 88, rank: 5 },
  { id: 'r6', name: '小赵', avatar: 'https://picsum.photos/id/1/200/200', points: 1820, completedTasks: 105, perfectHandovers: 82, rank: 6 },
  { id: 'r7', name: '小刘', avatar: 'https://picsum.photos/id/2/200/200', points: 1680, completedTasks: 98, perfectHandovers: 75, rank: 7 },
  { id: 'r8', name: '小孙', avatar: 'https://picsum.photos/id/3/200/200', points: 1550, completedTasks: 90, perfectHandovers: 70, rank: 8 },
  { id: 'r9', name: '小吴', avatar: 'https://picsum.photos/id/6/200/200', points: 1420, completedTasks: 85, perfectHandovers: 62, rank: 9 },
  { id: 'r10', name: '小郑', avatar: 'https://picsum.photos/id/8/200/200', points: 1300, completedTasks: 78, perfectHandovers: 55, rank: 10 }
]

export const mockFeedbacks: FeedbackItem[] = [
  { id: 'f1', authorName: '小周', authorAvatar: 'https://picsum.photos/id/91/200/200', content: '今天热玛吉FLX的耦合剂备货不足，建议增加常备数量', category: 'suggestion', createdAt: '2026-06-22 10:30', likes: 5, likedByMe: false, followUpStatus: 'unhandled' },
  { id: 'f2', authorName: '小李', authorAvatar: 'https://picsum.photos/id/64/200/200', content: '3号治疗室的空调温度不太稳定，顾客反馈有点冷', category: 'issue', createdAt: '2026-06-22 09:15', likes: 3, likedByMe: false, followUpStatus: 'followed' },
  { id: 'f3', authorName: '小陈', authorAvatar: 'https://picsum.photos/id/177/200/200', content: '小周今天的超声刀交接特别规范，步骤齐全，给新人做了好榜样！', category: 'praise', createdAt: '2026-06-21 17:00', likes: 12, likedByMe: false, followUpStatus: 'resolved' },
  { id: 'f4', authorName: '小王', authorAvatar: 'https://picsum.photos/id/338/200/200', content: '建议在治疗室增加计时提醒，避免超时影响下一单', category: 'suggestion', createdAt: '2026-06-21 15:30', likes: 8, likedByMe: false, followUpStatus: 'processing' },
  { id: 'f5', authorName: '小张', authorAvatar: 'https://picsum.photos/id/1027/200/200', content: '冷冻溶脂的耗材存放位置太远了，每次都要跑去仓库拿', category: 'issue', createdAt: '2026-06-21 11:00', likes: 6, likedByMe: false, followUpStatus: 'unhandled' }
]

export const mockLearningReminders: LearningReminder[] = [
  { id: 'l1', title: '热玛吉FLX新版操作规范', type: 'video', deadline: '2026-06-25', completed: false, points: 20 },
  { id: 'l2', title: '术后护理话术升级指南', type: 'article', deadline: '2026-06-26', completed: false, points: 15 },
  { id: 'l3', title: '超声刀安全操作知识测验', type: 'quiz', deadline: '2026-06-28', completed: false, points: 25 },
  { id: 'l4', title: '客户沟通技巧培训', type: 'video', deadline: '2026-06-30', completed: true, points: 20 },
  { id: 'l5', title: '冷冻溶脂术后注意事项', type: 'article', deadline: '2026-07-01', completed: false, points: 10 }
]
