import type { JSX } from 'preact';
import {
  brandVariants,
  buildRootStyle,
  buildVariantRootStyle,
  markViewBox,
  renderMarkChildren,
  renderVariantChildren,
  styleToCssText,
  type BrandMarkSharedProps,
  type BrandVariantKey,
  type BrandVariantSharedProps,
} from '@kolektiv/brand-core';

export interface BrandMarkProps
  extends Omit<
      JSX.SVGAttributes<SVGSVGElement>,
      'color' | 'style' | 'width' | 'height' | 'title' | 'children' | 'className'
    >,
    BrandMarkSharedProps {}

export function BrandMark({
  colors,
  parts,
  variant,
  color,
  title,
  style,
  className,
  class: classProp,
  ...rest
}: BrandMarkProps) {
  const rootStyle = styleToCssText(buildRootStyle({ colors, color, style }));
  const rootClass = className ?? classProp;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={markViewBox}
      fill="none"
      width="100%"
      class={rootClass}
      style={rootStyle}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
      dangerouslySetInnerHTML={{ __html: renderMarkChildren({ parts, variant, title }) }}
    />
  );
}

export interface BrandVariantProps
  extends Omit<
      JSX.SVGAttributes<SVGSVGElement>,
      'color' | 'style' | 'width' | 'height' | 'title' | 'children' | 'className'
    >,
    BrandVariantSharedProps {}

function createVariantComponent(key: BrandVariantKey, displayName: string) {
  function BrandVariant({
    colors,
    hoverColors,
    color,
    hoverColor,
    title,
    style,
    className,
    class: classProp,
    ...rest
  }: BrandVariantProps) {
    const rootStyle = styleToCssText(
      buildVariantRootStyle({ colors, hoverColors, color, hoverColor, style }),
    );
    const base = className ?? classProp;
    const rootClass = base ? `kolektiv-brand-hover ${base}` : 'kolektiv-brand-hover';

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={brandViewBox(key)}
        fill="none"
        width="100%"
        class={rootClass}
        style={rootStyle}
        role={title ? 'img' : undefined}
        aria-label={title || undefined}
        aria-hidden={title ? undefined : true}
        {...rest}
        dangerouslySetInnerHTML={{ __html: renderVariantChildren(key, { title }) }}
      />
    );
  }

  BrandVariant.displayName = displayName;
  return BrandVariant;
}

function brandViewBox(key: BrandVariantKey): string {
  return brandVariants[key].viewBox;
}

export const IconMark = createVariantComponent('iconMark', 'IconMark');
export const Wordmark = createVariantComponent('wordmark', 'Wordmark');
export const ComputingWordmark = createVariantComponent('computingWordmark', 'ComputingWordmark');
export const BuiltByMark = createVariantComponent('builtByMark', 'BuiltByMark');
