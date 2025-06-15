import { jest } from '@jest/globals'; // Required for jest.mock
import { GithubAPI } from './GithubAPI.js'; // Adjust path to GithubAPI.js
import { getAllRepos, getAllLanguages } from '../utils/github_utils.js'; // Import the original functions to be mocked

// Mock the github_utils module
jest.mock('../utils/github_utils.js');

describe('GithubAPI.getTopNLanguages', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        getAllRepos.mockClear();
        getAllLanguages.mockClear();
    });

    test('should process repository and language data correctly and return top N languages', async () => {
        // Mock implementations
        getAllRepos.mockResolvedValue([
            { name: 'repo1' },
            { name: 'repo2' },
            { name: 'repo3' },
        ]);

        getAllLanguages.mockImplementation(async (username, repoName) => {
            if (repoName === 'repo1') return { 'JavaScript': 1000, 'HTML': 500 };
            if (repoName === 'repo2') return { 'JavaScript': 2000, 'CSS': 300 };
            if (repoName === 'repo3') return { 'Python': 1500, 'JavaScript': 100 };
            return {};
        });

        const username = 'testuser';
        const topLangs = await GithubAPI.getTopNLanguages(username);

        // Expected calculations:
        // Total JS: 1000 + 2000 + 100 = 3100
        // Total HTML: 500
        // Total CSS: 300
        // Total Python: 1500
        // Grand Total Bytes: 3100 + 500 + 300 + 1500 = 5400
        // Percentages:
        // JS: (3100 / 5400) * 100 = 57.40... ~ 57%
        // Python: (1500 / 5400) * 100 = 27.77... ~ 28%
        // HTML: (500 / 5400) * 100 = 9.25... ~ 9%
        // CSS: (300 / 5400) * 100 = 5.55... ~ 6%

        // Order: JS, Python, HTML, CSS
        // Default TOP_N is 5, so all will be included.

        expect(getAllRepos).toHaveBeenCalledWith(username);
        expect(getAllLanguages).toHaveBeenCalledTimes(3);
        expect(getAllLanguages).toHaveBeenCalledWith(username, 'repo1');
        expect(getAllLanguages).toHaveBeenCalledWith(username, 'repo2');
        expect(getAllLanguages).toHaveBeenCalledWith(username, 'repo3');

        expect(topLangs).toEqual([
            ['JavaScript', 57], // 3100 bytes
            ['Python', 28],     // 1500 bytes
            ['HTML', 9],        // 500 bytes
            ['CSS', 6]          // 300 bytes
        ]);
    });

    test('should handle cases where fetching some languages fails', async () => {
        getAllRepos.mockResolvedValue([
            { name: 'repo1' },
            { name: 'repo2-fails' },
            { name: 'repo3' },
        ]);

        getAllLanguages.mockImplementation(async (username, repoName) => {
            if (repoName === 'repo1') return { 'JavaScript': 1000 };
            if (repoName === 'repo2-fails') throw new Error('API limit');
            if (repoName === 'repo3') return { 'Python': 500 };
            return {};
        });

        // Mock console.warn
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        const username = 'testuser';
        const topLangs = await GithubAPI.getTopNLanguages(username);

        // Expected: JS: 1000, Python: 500. Total: 1500
        // JS: (1000/1500)*100 = 66.66 ~ 67%
        // Python: (500/1500)*100 = 33.33 ~ 33%
        expect(topLangs).toEqual([
            ['JavaScript', 67],
            ['Python', 33],
        ]);
        expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Warning: Failed to fetch languages for a repository. Reason: API limit"));

        consoleWarnSpy.mockRestore(); // Clean up spy
    });

    test('should return empty array if no languages are found (e.g. all repos empty or fail)', async () => {
        getAllRepos.mockResolvedValue([ { name: 'emptyRepo' } ]);
        getAllLanguages.mockResolvedValue({}); // Empty language object

        const username = 'testuser';
        const topLangs = await GithubAPI.getTopNLanguages(username);
        expect(topLangs).toEqual([]);
    });

     test('should return empty array if there are no repositories', async () => {
        getAllRepos.mockResolvedValue([]); // No repositories

        const username = 'testuser';
        const topLangs = await GithubAPI.getTopNLanguages(username);

        expect(getAllLanguages).not.toHaveBeenCalled();
        expect(topLangs).toEqual([]);
    });
});
