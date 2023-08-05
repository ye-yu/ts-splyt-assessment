// to the creator of this puzzle: me no likey this question :'((((
import acorn from "acorn";
import { NodeRoot } from "./acorn.type";
import { DefaultArgsMeta } from "./default-args.type";

function defaultArguments<R, T extends (...args: any[]) => R>(
  fn: T,
  defaultArgs: Record<string, any>
): (...optionalMaybe: any[]) => ReturnType<T> {
  const defaultArgsMeta =
    "_defaultArguments" in fn
      ? (fn._defaultArguments as DefaultArgsMeta<R, T>)
      : null;
  const previouslyDefaultArgs = defaultArgsMeta?.defaultArgs ?? {};
  defaultArgs = {
    ...previouslyDefaultArgs,
    ...defaultArgs,
  };
  const originalFunction = defaultArgsMeta?.originalFunction ?? fn;

  const parsedSource =
    defaultArgsMeta?.parsedSource ??
    (acorn.parse(fn.toString(), {
      ecmaVersion: 2022,
    }) as NodeRoot);
  const [firstBody] = Array.isArray(parsedSource.body)
    ? parsedSource.body
    : [parsedSource.body];
  if (firstBody.type !== "FunctionDeclaration")
    throw new Error("parsed JS is not a function declaration");
  const paramNameToPosition = firstBody.params.reduce((a, b, i) => {
    a[b.name] = i;
    return a;
  }, {} as Record<string, number>);

  function newFunction() {
    const newArgs = [...arguments];
    Object.entries(defaultArgs).forEach(([name, value]) => {
      const position = paramNameToPosition[name];
      if (typeof position !== "number") return;
      newArgs[position] =
        typeof newArgs[position] === "undefined" ? value : newArgs[position];
    });
    return fn.apply(fn, newArgs);
  }

  newFunction._defaultArguments = {
    parsedSource,
    defaultArgs,
    originalFunction,
  };

  return newFunction as any;
}

function add(a: number, b: number) {
  return a + b;
}

const add2 = defaultArguments(add, { b: 9 });
console.assert(add2(10) === 19);
console.assert(add2(10, 7) === 17);
console.assert(isNaN(add2()));
const add3 = defaultArguments(add2, { b: 3, a: 2 });
console.assert(add3(10) === 13);
console.assert(add3() === 5);
const add4 = defaultArguments(add, { c: 3 }); // doesn't do anything, since c isn't an argument
console.assert(isNaN(add4(10)));
console.assert(add4(10, 10) === 20);
const add5 = defaultArguments(add2, { a: 10 }); //extends add2
console.assert(add5() === 19); // a=10, b=9
