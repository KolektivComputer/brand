import { computed, defineComponent, h, type PropType } from 'vue';
import {
  brandVariants,
  buildVariantRootStyle,
  renderVariantChildren,
  type BrandMarkColors,
  type BrandMarkStyle,
  type BrandVariantKey,
} from '@kolektiv/brand-core';

function createVariantComponent(key: BrandVariantKey, name: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      colors: { type: Object as PropType<BrandMarkColors>, default: undefined },
      hoverColors: { type: Object as PropType<BrandMarkColors>, default: undefined },
      color: { type: String, default: undefined },
      hoverColor: { type: String, default: undefined },
      title: { type: String, default: undefined },
      style: { type: Object as PropType<BrandMarkStyle>, default: undefined },
    },
    setup(props, { attrs }) {
      const rootStyle = computed(() =>
        buildVariantRootStyle({
          colors: props.colors,
          hoverColors: props.hoverColors,
          color: props.color,
          hoverColor: props.hoverColor,
          style: props.style,
        }),
      );

      const inner = computed(() => renderVariantChildren(key, { title: props.title }));

      return () => {
        const { class: attrClass, ...rest } = attrs as { class?: unknown };

        return h('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: brandVariants[key].viewBox,
          fill: 'none',
          width: '100%',
          class: ['kolektiv-brand-hover', attrClass],
          style: rootStyle.value,
          role: props.title ? 'img' : undefined,
          'aria-label': props.title || undefined,
          'aria-hidden': props.title ? undefined : true,
          ...rest,
          innerHTML: inner.value,
        });
      };
    },
  });
}

export const IconMark = createVariantComponent('iconMark', 'IconMark');
export const Wordmark = createVariantComponent('wordmark', 'Wordmark');
export const ComputingWordmark = createVariantComponent('computingWordmark', 'ComputingWordmark');
export const BuiltByMark = createVariantComponent('builtByMark', 'BuiltByMark');
