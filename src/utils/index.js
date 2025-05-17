import {
    defaultDirection, defaultLocale,
    defaultTheme,
    localeOptions,
    themeRadiusStorageKey,
    themeSelectedColorStorageKey
} from "@/constants/config.js";

export const getCurrentLanguage = () => {
    let locale = defaultLocale;
    try {
        if (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) {
            locale = localStorage.getItem('currentLanguage');
        }
    } catch (error) {
        console.log(">>>> src/utils/index.js : getCurrentLanguage -> error", error)
        locale = defaultLocale;
    }
    return locale;
}

export const setCurrentLanguage = (lang) => {
    try {
        localStorage.setItem('currentLanguage', lang)
    } catch (error) {
        console.log(">>>> src/utils/index.js : setCurrentLanguage -> error", error)
    }
}

export const getDirection = () => {
    setDirection('ltr')
    setCurrentLanguage('en')
    let direction = defaultDirection
    if (localStorage.getItem('direction')) {
        const localValue = localStorage.getItem('direction')
        if (localValue === 'rtl' || localValue === 'ltr') {
            direction = localValue
        }
    }
    return {
        direction,
        isRtl: direction === 'rtl'
    }
}

export const setDirection = localValue => {
    let direction = 'ltr'
    if (localValue === 'rtl' || localValue === 'ltr') {
        direction = localValue
    }
    localStorage.setItem('direction', direction)
}


export const getThemeColor = () => {
    let color = defaultTheme;
    try {
        if (localStorage.getItem(themeSelectedColorStorageKey)) {
            color = localStorage.getItem(themeSelectedColorStorageKey) || defaultTheme;
        }
    } catch (error) {
        console.log(">>>> src/utils/index.js : getThemeColor -> error", error)
        color = defaultTheme;
    }
    return color;
}

export const setThemeColor = (color) => {
    try {
        window.dispatchEvent(new CustomEvent('theme-localstorage-changed', {
            detail: {
                storage: localStorage.getItem(themeSelectedColorStorageKey)
            }
        }));
        localStorage.setItem(themeSelectedColorStorageKey, color);
    } catch (error) {
        console.log(">>>> src/utils/index.js : setThemeColor -> error", error)
    }
}

export const getThemeRadius = () => {
    let radius = "rounded";
    try {
        if (localStorage.getItem(themeRadiusStorageKey)) {
            radius = localStorage.getItem(themeRadiusStorageKey) || "rounded";
        }
    } catch (error) {
        console.log(">>>> src/utils/index.js : getThemeRadius -> error", error)
        radius = "rounded";
    }
    return radius;
}

export const setThemeRadius = (radius) => {
    try {
        localStorage.setItem(themeRadiusStorageKey, radius);
    } catch (error) {
        console.log(">>>> src/utils/index.js : setThemeRadius -> error", error)
    }
}
