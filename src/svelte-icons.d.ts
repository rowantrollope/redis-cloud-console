declare module "svelte-icons/fa/*" {
  import { SvelteComponentTyped } from "svelte";

  export default class Icon extends SvelteComponentTyped<{}, {}, {}> {}
}

declare module 'svelte-icons/*' {
    import { SvelteComponentTyped } from 'svelte';
    export default class extends SvelteComponentTyped {}
}
