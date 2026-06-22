import { HandoverItem } from '@/types'

export const mockHandovers: HandoverItem[] = [
  {
    id: 'h1',
    taskRef: 't1',
    customerName: 'L.J.',
    steps: [
      { id: 'h1s1', title: '清洁热玛吉探头', completed: true, type: 'clean' },
      { id: 'h1s2', title: '冷却治疗手柄', completed: true, type: 'cool' },
      { id: 'h1s3', title: '填写能量档位 3.0', completed: true, type: 'energy' },
      { id: 'h1s4', title: '交接给 小周', completed: true, type: 'handover' }
    ],
    isCompleted: true,
    delayMinutes: 0,
    delayReason: '',
    delayScript: '',
    energyInput: '3.0'
  },
  {
    id: 'h2',
    taskRef: 't2',
    customerName: 'W.X.',
    steps: [
      { id: 'h2s1', title: '清洁超声刀探头', completed: true, type: 'clean' },
      { id: 'h2s2', title: '冷却治疗手柄', completed: false, type: 'cool' },
      { id: 'h2s3', title: '填写能量档位', completed: false, type: 'energy' },
      { id: 'h2s4', title: '交接给 小陈', completed: false, type: 'handover' }
    ],
    isCompleted: false,
    delayMinutes: 0,
    delayReason: '',
    delayScript: '',
    energyInput: ''
  },
  {
    id: 'h3',
    taskRef: 't4',
    customerName: 'C.Y.',
    steps: [
      { id: 'h3s1', title: '清洁冷冻溶脂吸头', completed: false, type: 'clean' },
      { id: 'h3s2', title: '冷却治疗手柄', completed: false, type: 'cool' },
      { id: 'h3s3', title: '填写能量档位', completed: false, type: 'energy' },
      { id: 'h3s4', title: '交接给 小周', completed: false, type: 'handover' }
    ],
    isCompleted: false,
    delayMinutes: 15,
    delayReason: '顾客对溶脂效果有额外疑问，需延长咨询时间',
    delayScript: '您好，C.Y.的治疗稍有延迟，预计还需15分钟。您可以先帮下位顾客做皮肤检测，我完成后第一时间通知您。',
    energyInput: ''
  },
  {
    id: 'h4',
    taskRef: 't9',
    customerName: 'F.N.',
    steps: [
      { id: 'h4s1', title: '清洁超声刀探头', completed: true, type: 'clean' },
      { id: 'h4s2', title: '冷却治疗手柄', completed: true, type: 'cool' },
      { id: 'h4s3', title: '填写能量档位 3.5', completed: true, type: 'energy' },
      { id: 'h4s4', title: '交接给 小李', completed: true, type: 'handover' }
    ],
    isCompleted: true,
    delayMinutes: 0,
    delayReason: '',
    delayScript: '',
    energyInput: '3.5'
  },
  {
    id: 'h5',
    taskRef: 't6',
    customerName: 'S.Q.',
    steps: [
      { id: 'h5s1', title: '清洁光子手柄', completed: true, type: 'clean' },
      { id: 'h5s2', title: '冷却治疗手柄', completed: true, type: 'cool' },
      { id: 'h5s3', title: '填写能量档位 2.5', completed: false, type: 'energy' },
      { id: 'h5s4', title: '交接给 小李', completed: false, type: 'handover' }
    ],
    isCompleted: false,
    delayMinutes: 0,
    delayReason: '',
    delayScript: '',
    energyInput: ''
  }
]
