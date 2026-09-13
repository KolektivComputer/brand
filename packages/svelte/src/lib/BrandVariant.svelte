<script lang="ts">
  import {
    brandVariants,
    buildVariantRootStyle,
    renderVariantChildren,
    styleToCssText,
    type BrandVariantKey,
    type BrandVariantSharedProps,
  } from '@kolektiv/brand-core';

  type BrandVariantProps = BrandVariantSharedProps & {
    variant: BrandVariantKey;
    class?: string;
    [key: string]: unknown;
  };

  let {
    variant,
    colors,
    hoverColors,
    color,
    hoverColor,
    title,
    class: className = '',
    style,
    ...rest
  }: BrandVariantProps = $props();

  const inner = $derived(renderVariantChildren(variant, { title }));
  const rootStyle = $derived(
    styleToCssText(buildVariantRootStyle({ colors, hoverColors, color, hoverColor, style })),
  );
  const rootClass = $derived(
    className ? `kolektiv-brand-hover ${className}` : 'kolektiv-brand-hover',
  );
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox={brandVariants[variant].viewBox}
  fill="none"
  width="100%"
  class={rootClass}
  style={rootStyle}
  role={title ? 'img' : undefined}
  aria-label={title || undefined}
  aria-hidden={title ? undefined : true}
  {...rest}
>
  {@html inner}
</svg>
