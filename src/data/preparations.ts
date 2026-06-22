import { PrepStep } from '@/types'

export const mockPrepSteps: PrepStep[] = [
  {
    id: 'p1',
    title: '检查热玛吉FLX探头',
    description: '确认探头编号与预约单一致，检查耦合剂余量',
    completed: true,
    category: 'equipment'
  },
  {
    id: 'p2',
    title: '预热超声刀设备',
    description: '开机预热至少10分钟，确认自检通过',
    completed: true,
    category: 'equipment'
  },
  {
    id: 'p3',
    title: '消毒治疗室操作台',
    description: '使用75%酒精擦拭操作台面，紫外线消毒30分钟',
    completed: false,
    category: 'disinfection'
  },
  {
    id: 'p4',
    title: '备齐一次性耗材',
    description: '耦合剂、无菌纱布、眼罩、头套、手套',
    completed: false,
    category: 'material'
  },
  {
    id: 'p5',
    title: '确认治疗室温湿度',
    description: '温度22-26°C，湿度40-60%',
    completed: true,
    category: 'room'
  },
  {
    id: 'p6',
    title: '检查冷冻溶脂耗材',
    description: '确认凝胶垫和吸头膜数量充足',
    completed: false,
    category: 'equipment'
  },
  {
    id: 'p7',
    title: '消毒手柄及探头',
    description: '按规范消毒所有治疗手柄和探头，记录消毒时间',
    completed: false,
    category: 'disinfection'
  },
  {
    id: 'p8',
    title: '检查光子嫩肤滤光片',
    description: '确认560/590/640滤光片齐备无损坏',
    completed: true,
    category: 'equipment'
  },
  {
    id: 'p9',
    title: '准备拍照建档设备',
    description: '确认VISIA皮肤检测仪已校准，相机存储卡空间充足',
    completed: false,
    category: 'material'
  },
  {
    id: 'p10',
    title: '核查知情同意书',
    description: '确认今日所有预约顾客的知情同意书已打印并签字',
    completed: false,
    category: 'material'
  }
]
