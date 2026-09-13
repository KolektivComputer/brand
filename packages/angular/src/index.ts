import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import {
  brandVariants,
  buildRootStyle,
  buildVariantRootStyle,
  markViewBox,
  renderBrandMark,
  renderBrandVariant,
  renderMarkChildren,
  renderVariantChildren,
  styleToCssText,
  type BrandMarkColors,
  type BrandMarkStyle,
  type BrandMarkVariant,
  type BrandMarkVisibility,
  type BrandVariantKey,
} from '@kolektiv/brand-core';

/** Pure string helpers (SSR / non-component use). */
export function brandMarkHtml(options: Parameters<typeof renderBrandMark>[0] = {}): string {
  return renderBrandMark(options);
}

export function brandVariantHtml(
  key: BrandVariantKey,
  options: Parameters<typeof renderBrandVariant>[1] = {},
): string {
  return renderBrandVariant(key, options);
}

const VARIANT_TEMPLATE = `<svg
  xmlns="http://www.w3.org/2000/svg"
  [attr.viewBox]="state.viewBox()"
  fill="none"
  width="100%"
  [class]="state.hostClass()"
  [style]="state.styleText()"
  [attr.role]="title() ? 'img' : null"
  [attr.aria-label]="title() || null"
  [attr.aria-hidden]="title() ? null : 'true'"
  [innerHTML]="state.inner()"
></svg>`;

interface VariantInputs {
  colors: () => BrandMarkColors | undefined;
  hoverColors: () => BrandMarkColors | undefined;
  color: () => string | undefined;
  hoverColor: () => string | undefined;
  title: () => string | undefined;
  style: () => BrandMarkStyle | undefined;
  className: () => string | undefined;
}

function variantState(key: BrandVariantKey, inputs: VariantInputs, sanitizer: DomSanitizer) {
  return {
    viewBox: computed(() => brandVariants[key].viewBox),
    inner: computed<SafeHtml>(() =>
      sanitizer.bypassSecurityTrustHtml(
        renderVariantChildren(key, { title: inputs.title() }),
      ),
    ),
    styleText: computed(() =>
      styleToCssText(
        buildVariantRootStyle({
          colors: inputs.colors(),
          hoverColors: inputs.hoverColors(),
          color: inputs.color(),
          hoverColor: inputs.hoverColor(),
          style: inputs.style(),
        }),
      ),
    ),
    hostClass: computed(() => {
      const base = inputs.className();
      return base ? `kolektiv-brand-hover ${base}` : 'kolektiv-brand-hover';
    }),
  };
}

@Component({
  selector: 'kolektiv-brand-mark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.viewBox]="viewBox"
    fill="none"
    width="100%"
    [class]="hostClass()"
    [style]="styleText()"
    [attr.role]="title() ? 'img' : null"
    [attr.aria-label]="title() || null"
    [attr.aria-hidden]="title() ? null : 'true'"
    [innerHTML]="inner()"
  ></svg>`,
})
export class KolektivBrandMark {
  private readonly sanitizer = inject(DomSanitizer);

  readonly colors = input<BrandMarkColors>();
  readonly parts = input<BrandMarkVisibility>();
  readonly variant = input<BrandMarkVariant>();
  readonly color = input<string>();
  readonly title = input<string>();
  readonly style = input<BrandMarkStyle>();
  readonly className = input<string>();

  protected readonly viewBox = markViewBox;
  protected readonly inner = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      renderMarkChildren({ parts: this.parts(), variant: this.variant(), title: this.title() }),
    ),
  );
  protected readonly styleText = computed(() =>
    styleToCssText(
      buildRootStyle({ colors: this.colors(), color: this.color(), style: this.style() }),
    ),
  );
  protected hostClass(): string | null {
    return this.className() ?? null;
  }
}

@Component({
  selector: 'kolektiv-icon-mark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: VARIANT_TEMPLATE,
})
export class KolektivIconMark {
  private readonly sanitizer = inject(DomSanitizer);
  readonly colors = input<BrandMarkColors>();
  readonly hoverColors = input<BrandMarkColors>();
  readonly color = input<string>();
  readonly hoverColor = input<string>();
  readonly title = input<string>();
  readonly style = input<BrandMarkStyle>();
  readonly className = input<string>();
  protected readonly state = variantState('iconMark', this, this.sanitizer);
}

@Component({
  selector: 'kolektiv-wordmark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: VARIANT_TEMPLATE,
})
export class KolektivWordmark {
  private readonly sanitizer = inject(DomSanitizer);
  readonly colors = input<BrandMarkColors>();
  readonly hoverColors = input<BrandMarkColors>();
  readonly color = input<string>();
  readonly hoverColor = input<string>();
  readonly title = input<string>();
  readonly style = input<BrandMarkStyle>();
  readonly className = input<string>();
  protected readonly state = variantState('wordmark', this, this.sanitizer);
}

@Component({
  selector: 'kolektiv-computing-wordmark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: VARIANT_TEMPLATE,
})
export class KolektivComputingWordmark {
  private readonly sanitizer = inject(DomSanitizer);
  readonly colors = input<BrandMarkColors>();
  readonly hoverColors = input<BrandMarkColors>();
  readonly color = input<string>();
  readonly hoverColor = input<string>();
  readonly title = input<string>();
  readonly style = input<BrandMarkStyle>();
  readonly className = input<string>();
  protected readonly state = variantState('computingWordmark', this, this.sanitizer);
}

@Component({
  selector: 'kolektiv-built-by-mark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: VARIANT_TEMPLATE,
})
export class KolektivBuiltByMark {
  private readonly sanitizer = inject(DomSanitizer);
  readonly colors = input<BrandMarkColors>();
  readonly hoverColors = input<BrandMarkColors>();
  readonly color = input<string>();
  readonly hoverColor = input<string>();
  readonly title = input<string>();
  readonly style = input<BrandMarkStyle>();
  readonly className = input<string>();
  protected readonly state = variantState('builtByMark', this, this.sanitizer);
}
