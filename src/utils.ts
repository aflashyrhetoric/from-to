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
        const newStyles = bool
            ? createStyleObjectPayload(animation.to)
            : createStyleObjectPayload(animation.from);

        applyStylesToElement(ref.current, newStyles);
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

function detectDisplayChange(fromTo: "from" | "to", animation: FromToAnimation) {
    // Check if to/from has the word display
    const styleObj = animation[fromTo];
    return Object.keys(styleObj).includes("display");
}
