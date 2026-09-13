import * as React from 'react';
import {
  brandVariants,
  buildVariantRootStyle,
  renderVariantChildren,
  type BrandVariantKey,
  type BrandVariantSharedProps,
} from '@kolektiv/brand-core';

export interface BrandVariantProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'color' | 'style' | 'title' | 'children'>,
    BrandVariantSharedProps {}

function createVariantComponent(key: BrandVariantKey, displayName: string) {
  const Component = React.forwardRef<SVGSVGElement, BrandVariantProps>(function BrandVariant(
    { colors, hoverColors, color, hoverColor, title, style, className, ...rest },
    ref,
  ) {
    const rootStyle = buildVariantRootStyle({
      colors,
      hoverColors,
      color,
      hoverColor,
      style,
    }) as unknown as React.CSSProperties;

    const rootClassName = className ? `kolektiv-brand-hover ${className}` : 'kolektiv-brand-hover';

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={brandVariants[key].viewBox}
        fill="none"
        width="100%"
        className={rootClassName}
        style={rootStyle}
        role={title ? 'img' : undefined}
        aria-label={title || undefined}
        aria-hidden={title ? undefined : true}
        {...rest}
        dangerouslySetInnerHTML={{ __html: renderVariantChildren(key, { title }) }}
      />
    );
  });

  Component.displayName = displayName;
  return Component;
}

export const IconMark = createVariantComponent('iconMark', 'IconMark');
export const Wordmark = createVariantComponent('wordmark', 'Wordmark');
export const ComputingWordmark = createVariantComponent('computingWordmark', 'ComputingWordmark');
export const BuiltByMark = createVariantComponent('builtByMark', 'BuiltByMark');
