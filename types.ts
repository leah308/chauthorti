export type Dimension = 'emotional' | 'rational' | 'social' | 'life' | 'belief' | 'resilience';

export const DIMENSION_NAMES: Record<Dimension, string> = {
  emotional: '情感表达',
  rational: '思维焦点',
  social: '社会立场',
  life: '人生关注',
  belief: '处世信念',
  resilience: '心理韧性',
};

export const DIMENSION_POLARS: Record<Dimension, { left: string; right: string }> = {
  emotional: { left: '内敛', right: '热烈' },
  rational: { left: '具象', right: '抽象' },
  social: { left: '保守', right: '激进' },
  life: { left: '个人', right: '社会' },
  belief: { left: '犬儒', right: '理想' },
  resilience: { left: '脆弱', right: '坚韧' },
};

export interface Writer {
  name: string;
  scores: Record<Dimension, number>;
  quote: string;
  detailedDescription: string;
  literatureExcerpt?: string;
}

export interface Option {
  text: string;
  effects: Partial<Record<Dimension, number>>;
}

export interface Question {
  text: string;
  options: Option[];
}
