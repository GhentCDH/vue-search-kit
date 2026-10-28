import Articles from "articles";

/**
 * Translatable defaults for the placeholders the form generator sets on
 * select fields. Apps merge these into their vue-i18n messages (or override
 * them); without them the English fallbacks below are used.
 */
export const searchKitMessages = {
    en: {
        vsk: {
            placeholder: {
                select: 'Select {article} {label}',
                dependency: 'Please select {article} {label} first',
                empty: 'No {label} available',
                loading: 'Loading',
            },
        },
    },
    fr: {
        vsk: {
            placeholder: {
                select: 'Faites un choix',
                dependency: "Sélectionnez d'abord : {label}",
                empty: 'Aucune valeur disponible pour {label}',
                loading: 'Chargement…',
            },
        },
    },
}

export type PlaceholderKind = 'select' | 'dependency' | 'empty' | 'loading'

export interface Translator {
    t: (key: string, named?: Record<string, unknown>) => string
    te: (key: string) => boolean
}

/**
 * Default placeholder for a select field of the given kind, e.g.
 * defaultPlaceholder('select', 'Diocese') → 'Select a diocese'.
 * Uses the `vsk.placeholder.<kind>` message when the translator has one.
 */
export function defaultPlaceholder(kind: PlaceholderKind, label: string, translator?: Translator): string {
    const lowerLabel = label.toLowerCase()
    const article = Articles.articlize(lowerLabel).split(' ')[0]
    const key = `vsk.placeholder.${kind}`

    if (translator?.te(key)) {
        return translator.t(key, {label: lowerLabel, article})
    }

    const fallback = searchKitMessages.en.vsk.placeholder[kind]
    return fallback.replace('{article}', article).replace('{label}', lowerLabel)
}

/**
 * String.localeCompare with the given locale; falls back to English when the
 * locale is not a valid BCP 47 tag (e.g. 'fr_BE'), which would otherwise throw.
 */
export function localeCompareSafe(a: string, b: string, locale: string): number {
    try {
        return a.localeCompare(b, locale, {sensitivity: 'base'})
    } catch (e) {
        return a.localeCompare(b, 'en', {sensitivity: 'base'})
    }
}
