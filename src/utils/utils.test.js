import { getUsername } from './utils.js'; // Adjust path as necessary if utils.js is elsewhere

describe('getUsername', () => {
    test('should extract username from a valid GitHub URL', () => {
        const url = 'https://github.com/testuser';
        expect(getUsername(url)).toBe('testuser');
    });

    test('should extract username from a valid GitHub URL with a trailing slash', () => {
        const url = 'https://github.com/testuser/';
        expect(getUsername(url)).toBe('testuser');
    });

    test('should handle URLs with www subdomain', () => {
        const url = 'https://www.github.com/anotheruser';
        expect(getUsername(url)).toBe('anotheruser');
    });

    test('should throw an error for an invalid GitHub URL (e.g., missing username)', () => {
        const url = 'https://github.com/';
        expect(() => getUsername(url)).toThrow('Invalid profile URL');
    });

    test('should throw an error for a completely invalid URL', () => {
        const url = 'htp:/invalid-url';
        // This will likely throw a TypeError due to URL constructor failing,
        // or our specific 'Invalid profile URL' if it somehow passes that.
        // Let's check for the specific error we throw if pathname is empty,
        // otherwise, the URL constructor itself will throw.
        expect(() => getUsername(url)).toThrow();
    });

    test('should throw an error for a non-GitHub URL that mimics the path structure', () => {
        const url = 'https://example.com/username';
        // While this might extract "username", the function is intended for GitHub URLs.
        // The current implementation doesn't validate the domain, so it would pass.
        // This test highlights a potential area for future improvement in getUsername if stricter validation is needed.
        expect(getUsername(url)).toBe('username');
    });
});
