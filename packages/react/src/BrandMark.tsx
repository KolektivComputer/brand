import * as React from 'react';
import {
  buildRootStyle,
  markViewBox,
  renderMarkChildren,
  type BrandMarkSharedProps,
} from '@kolektiv/brand-core';

export interface BrandMarkProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'color' | 'style' | 'title' | 'children'>,
    BrandMarkSharedProps {}

export const BrandMark = React.forwardRef<SVGSVGElement, BrandMarkProps>(function BrandMark(
  { colors, parts, variant, color, title, style, className, ...rest },
  ref,
) {
  const rootStyle = buildRootStyle({ colors, color, style }) as unknown as React.CSSProperties;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={markViewBox}
      fill="none"
      width="100%"
      style={rootStyle}
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
      dangerouslySetInnerHTML={{ __html: renderMarkChildren({ parts, variant, title }) }}
    />
  );
});
