import {describe, it, expect} from 'vitest';
import {localeCompareSafe} from "../src/helpers/placeholders";

describe('localeCompareSafe', () => {
    it('compares with the given locale', () => {
        expect(localeCompareSafe('a', 'B', 'fr')).toBeLessThan(0);
    });

    it('does not throw for an invalid locale tag and falls back to English', () => {
        expect(() => localeCompareSafe('a', 'b', 'fr_BE')).not.toThrow();
        expect(localeCompareSafe('a', 'b', 'fr_BE')).toBeLessThan(0);
    });
});
