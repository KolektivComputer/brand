<script lang="ts">
  import type { BrandVariantSharedProps } from '@kolektiv/brand-core';
  import BrandVariant from './BrandVariant.svelte';

  let { ...rest }: BrandVariantSharedProps & { class?: string; [key: string]: unknown } = $props();
</script>

<BrandVariant variant="wordmark" {...rest} />
