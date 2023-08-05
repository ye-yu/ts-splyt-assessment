import { Node } from 'acorn';

export interface NodeRoot extends Node {
  type: string
  start: number
  end: number
  body: NodeRoot | NodeRoot[]
  sourceType: string
  id: Id
  expression: boolean
  generator: boolean
  async: boolean
  params: NodeRoot[]
  argument?: NodeRoot
  name: string
  left: NodeRoot
  operator: string
  right: NodeRoot
}

export interface Id {
  type: string
  start: number
  end: number
  name: string
}
