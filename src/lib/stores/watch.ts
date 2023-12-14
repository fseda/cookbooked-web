import { onDestroy } from "svelte";
import { derived, type Writable } from "svelte/store";

type depsType = Writable<string|number|boolean|(string|number|boolean)[]>
type funcType = string|number|boolean|(string|number|boolean)[];

export function watch(deps: depsType, fn: (a: funcType) => void): void {
  const unsubscribe = derived(deps, v => v).subscribe(fn);
  onDestroy(unsubscribe);
}
