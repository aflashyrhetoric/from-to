import type { FromToAnimation } from "./core";
import { essentialStyles } from "./shared/essentialStyles";

export function cssStyleDeclarationToObject(cssStyleDeclaration: CSSStyleDeclaration) {
    const styleObj: { [key: string]: string } = {};
    for (let i = 0; i < cssStyleDeclaration.length; i++) {
        const cssPropName = cssStyleDeclaration[i];
        const cssPropValue = cssStyleDeclaration.getPropertyValue(cssPropName);

        // Convert kebab-case CSS property names to camelCase for React
        const camelCasePropName = cssPropName.replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[camelCasePropName] = cssPropValue;
    }
    return styleObj;
}

export function applyStylesToElement(element: HTMLDivElement, stylesObj: any) {
    Object.keys(stylesObj).forEach(property => {
        // Convert camelCase to kebab-case for CSS properties
        const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();
        element.style.setProperty(cssProperty, stylesObj[property]);
    });
}

export function triggerAnimations(
    ref: React.RefObject<any>,
    bool: boolean,
    animations: FromToAnimation[]
) {
    function triggerAnimation(animation: FromToAnimation) {
        const targetStyles = bool ? animation.to : animation.from;
        const sourceStyles = bool ? animation.from : animation.to;

        // Check if we're dealing with display property changes
        const hasDisplayChange = 'display' in targetStyles || 'display' in sourceStyles;

        if (hasDisplayChange) {
            handleDisplayAnimation(targetStyles, sourceStyles);
        } else {
            // Normal animation without display changes
            const newStyles = createStyleObjectPayload(targetStyles);
            applyStylesToElement(ref.current, newStyles);
        }
    }

    function handleDisplayAnimation(
        targetStyles: any,
        sourceStyles: any
    ) {
        const targetDisplay = targetStyles.display;
        const sourceDisplay = sourceStyles.display || getComputedStyle(ref.current).display;

        // Get animation duration from the styles (default to 300ms if not specified)
        const duration = parseDuration(targetStyles.transitionDuration || targetStyles.animationDuration || '300ms');

        // Handle auto height/width measurements
        const measuredDimensions = measureAutoProperties(targetStyles, sourceStyles, targetDisplay);

        // Merge measured dimensions into target styles
        const enhancedTargetStyles = { ...targetStyles, ...measuredDimensions };

        // Case 1: Animating FROM display:none TO display:block/flex/etc
        // We need to set display first, then animate other properties
        if (sourceDisplay === 'none' && targetDisplay && targetDisplay !== 'none') {
            // Step 1: Set display immediately so element becomes visible
            applyStylesToElement(ref.current, { display: targetDisplay });

            // Step 2: Force a reflow to ensure display is applied
            void ref.current.offsetHeight;

            // Step 3: Apply all other styles (opacity, transform, etc.)
            const newStyles = createStyleObjectPayload(enhancedTargetStyles);
            applyStylesToElement(ref.current, newStyles);
        }
        // Case 2: Animating FROM display:block/flex/etc TO display:none
        // We need to animate other properties first, then set display:none at the end
        else if (targetDisplay === 'none' && sourceDisplay !== 'none') {
            // Step 1: Apply all styles EXCEPT display
            const stylesWithoutDisplay = { ...enhancedTargetStyles };
            delete stylesWithoutDisplay.display;

            const newStyles = createStyleObjectPayload(stylesWithoutDisplay);
            applyStylesToElement(ref.current, newStyles);

            // Step 2: Set display:none after animation completes
            setTimeout(() => {
                if (ref.current) {
                    applyStylesToElement(ref.current, { display: 'none' });
                }
            }, duration);
        }
        // Case 3: Display changes between visible values (block -> flex, etc.)
        else {
            const newStyles = createStyleObjectPayload(enhancedTargetStyles);
            applyStylesToElement(ref.current, newStyles);
        }
    }

    function measureAutoProperties(
        targetStyles: any,
        sourceStyles: any,
        targetDisplay?: string
    ): Partial<{ height: string; width: string }> {
        const measured: Partial<{ height: string; width: string }> = {};

        // Check if height is set to 'auto' and we need to measure it
        if (targetStyles.height === 'auto') {
            const naturalHeight = measureNaturalDimension('height', targetDisplay);
            if (naturalHeight !== null) {
                measured.height = `${naturalHeight}px`;
            }
        }

        // Check if width is set to 'auto' and we need to measure it
        if (targetStyles.width === 'auto') {
            const naturalWidth = measureNaturalDimension('width', targetDisplay);
            if (naturalWidth !== null) {
                measured.width = `${naturalWidth}px`;
            }
        }

        return measured;
    }

    function measureNaturalDimension(
        dimension: 'height' | 'width',
        targetDisplay?: string
    ): number | null {
        if (!ref.current) return null;

        const element = ref.current;
        const currentDisplay = element.style.display;
        const currentPosition = element.style.position;
        const currentVisibility = element.style.visibility;
        const currentDimension = element.style[dimension];

        // Temporarily make element measurable but invisible
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.display = targetDisplay || 'block';
        element.style[dimension] = 'auto';

        // Force reflow
        void element.offsetHeight;

        // Measure the natural dimension
        const naturalSize = dimension === 'height' ? element.offsetHeight : element.offsetWidth;

        // Restore original styles
        element.style.display = currentDisplay;
        element.style.position = currentPosition;
        element.style.visibility = currentVisibility;
        element.style[dimension] = currentDimension;

        return naturalSize;
    }

    function parseDuration(durationStr: string): number {
        // Parse duration string like '300ms' or '1s' to milliseconds
        if (!durationStr) return 300;

        const match = durationStr.match(/^([\d.]+)(m?s)$/i);
        if (!match) return 300;

        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        return unit === 's' ? value * 1000 : value;
    }

    function createStyleObjectPayload(styles: any) {
        const currentStyle = ref.current.style;
        const currentStyleObj = cssStyleDeclarationToObject(currentStyle);
        return { ...essentialStyles, ...currentStyleObj, ...styles };
    }

    // Create each
    animations.forEach(animation => {
        triggerAnimation(animation);
    });
}