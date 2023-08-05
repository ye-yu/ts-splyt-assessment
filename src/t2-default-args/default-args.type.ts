import { NodeRoot } from "./acorn.type";

export interface DefaultArgsMeta<R, T extends (...args: any[]) => R> {
  parsedSource: NodeRoot
  defaultArgs: Record<string, any>
  originalFunction: T
}