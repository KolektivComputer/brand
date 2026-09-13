<script lang="ts">
  import {
    buildRootStyle,
    markViewBox,
    renderMarkChildren,
    styleToCssText,
    type BrandMarkSharedProps,
  } from '@kolektiv/brand-core';

  type BrandMarkProps = BrandMarkSharedProps & {
    class?: string;
    [key: string]: unknown;
  };

  let {
    colors,
    parts,
    variant,
    color,
    title,
    class: className = '',
    style,
    ...rest
  }: BrandMarkProps = $props();

  const inner = $derived(renderMarkChildren({ parts, variant, title }));
  const rootStyle = $derived(styleToCssText(buildRootStyle({ colors, color, style })));
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox={markViewBox}
  fill="none"
  width="100%"
  class={className}
  style={rootStyle}
  role={title ? 'img' : undefined}
  aria-label={title || undefined}
  aria-hidden={title ? undefined : true}
  {...rest}
>
  {@html inner}
</svg>
