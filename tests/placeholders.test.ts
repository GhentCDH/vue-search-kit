import {describe, it, expect} from 'vitest';
import {defaultPlaceholder, searchKitMessages} from "../src/helpers/placeholders";

const translatorFor = (locale: 'en' | 'fr') => {
    const messages: Record<string, string> = searchKitMessages[locale].vsk.placeholder;
    return {
        te: (key: string) => key.replace('vsk.placeholder.', '') in messages,
        t: (key: string, named: Record<string, unknown> = {}) =>
            messages[key.replace('vsk.placeholder.', '')].replace(/\{(\w+)\}/g, (_, k) => String(named[k] ?? '')),
    };
};

describe('defaultPlaceholder', () => {
    it('builds the English select placeholder without a translator', () => {
        expect(defaultPlaceholder('select', 'Diocese')).toBe('Select a diocese');
    });

    it('builds the English dependency and empty placeholders without a translator', () => {
        expect(defaultPlaceholder('dependency', 'Institution')).toBe('Please select an institution first');
        expect(defaultPlaceholder('empty', 'Diocese')).toBe('No diocese available');
        expect(defaultPlaceholder('loading', 'Diocese')).toBe('Loading');
    });

    it('uses translated messages when available', () => {
        const fr = translatorFor('fr');
        expect(defaultPlaceholder('select', 'Diocèse', fr)).toBe('Faites un choix');
        expect(defaultPlaceholder('empty', 'Diocèse', fr)).toBe('Aucune valeur disponible pour diocèse');
        expect(defaultPlaceholder('loading', 'Diocèse', fr)).toBe('Chargement…');
    });

    it('falls back to English when the translator has no message', () => {
        const none = {te: () => false, t: () => 'never'};
        expect(defaultPlaceholder('select', 'Diocese', none)).toBe('Select a diocese');
    });
});
