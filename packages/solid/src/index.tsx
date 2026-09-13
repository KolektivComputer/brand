import { splitProps, type Component, type JSX } from 'solid-js';
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
      JSX.SvgSVGAttributes<SVGSVGElement>,
      'color' | 'style' | 'width' | 'height' | 'title' | 'children'
    >,
    BrandMarkSharedProps {}

export const BrandMark: Component<BrandMarkProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'colors',
    'parts',
    'variant',
    'color',
    'title',
    'style',
    'className',
  ]);

  const rootStyle = () =>
    styleToCssText(buildRootStyle({ colors: local.colors, color: local.color, style: local.style }));
  const inner = () =>
    renderMarkChildren({ parts: local.parts, variant: local.variant, title: local.title });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={markViewBox}
      fill="none"
      width="100%"
      class={local.className}
      style={rootStyle()}
      role={local.title ? 'img' : undefined}
      aria-label={local.title || undefined}
      aria-hidden={local.title ? undefined : true}
      {...rest}
      innerHTML={inner()}
    />
  );
};

export interface BrandVariantProps
  extends Omit<
      JSX.SvgSVGAttributes<SVGSVGElement>,
      'color' | 'style' | 'width' | 'height' | 'title' | 'children'
    >,
    BrandVariantSharedProps {}

function createVariantComponent(key: BrandVariantKey): Component<BrandVariantProps> {
  return (props) => {
    const [local, rest] = splitProps(props, [
      'colors',
      'hoverColors',
      'color',
      'hoverColor',
      'title',
      'style',
      'className',
    ]);

    const rootStyle = () =>
      styleToCssText(
        buildVariantRootStyle({
          colors: local.colors,
          hoverColors: local.hoverColors,
          color: local.color,
          hoverColor: local.hoverColor,
          style: local.style,
        }),
      );
    const rootClass = () =>
      local.className ? `kolektiv-brand-hover ${local.className}` : 'kolektiv-brand-hover';
    const inner = () => renderVariantChildren(key, { title: local.title });

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={brandVariants[key].viewBox}
        fill="none"
        width="100%"
        class={rootClass()}
        style={rootStyle()}
        role={local.title ? 'img' : undefined}
        aria-label={local.title || undefined}
        aria-hidden={local.title ? undefined : true}
        {...rest}
        innerHTML={inner()}
      />
    );
  };
}

export const IconMark = createVariantComponent('iconMark');
export const Wordmark = createVariantComponent('wordmark');
export const ComputingWordmark = createVariantComponent('computingWordmark');
export const BuiltByMark = createVariantComponent('builtByMark');
