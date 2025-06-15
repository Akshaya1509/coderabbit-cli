import { DEFAULT_TOP_N } from "../lib/constants.js";

// Regex to validate GitHub profile URL and extract username
// Matches:
// - http(s)://(www.)github.com/username
// - github.com/username
// It captures the username in group 1 (or 2 if protocol is missing)
const GITHUB_PROFILE_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)(?:\/)?$/;


function getUsername(profileUrl) {
    if (typeof profileUrl !== 'string') {
        throw new Error('Invalid GitHub profile URL format. Expected a string.');
    }

    const match = profileUrl.match(GITHUB_PROFILE_URL_REGEX);

    if (!match || !match[1]) {
        throw new Error('Invalid GitHub profile URL format. Expected format: https://github.com/username');
    }

    // The username is in the first capturing group
    const username = match[1];

    // Ensure username is not empty (though regex should prevent this if it matches)
    if (username.length === 0) {
        throw new Error('Invalid GitHub profile URL format. Username cannot be empty.');
    }
    return username;
}

function getLanguagesCount(languages) {
    // parse array of languages: [ { <lang>: <bytes> }]
    const languagesCountMap = new Map();
    for (let obj of languages) {
        for (let [language, bytes] of Object.entries(obj)) {
            if (languagesCountMap.has(language)) {
                languagesCountMap.set(
                    language, 
                    languagesCountMap.get(language) + bytes
                );
            } else {
                languagesCountMap.set(language, bytes);
            }
        }
    }
    return languagesCountMap;
}

function getTopN(languagesCountMap, N = DEFAULT_TOP_N) {
    let languagesList = Array.from(languagesCountMap);

    // Sort Languages by Bytes in Descending order
    languagesList.sort((arr1, arr2) => {
        return arr2[1] - arr1[1];
    });
        
    // Get Total Bytes
    const totalBytes = languagesList.reduce((total, item) => {
        return total + item[1];
    }, 0);

    // If totalBytes is 0, return an empty array to avoid division by zero
    if (totalBytes === 0) {
        return [];
    }

    // Calculate percentage of languages
    languagesList = languagesList.slice(0, N);
    const topN = languagesList.map(item => {
        item[1] = Math.round((item[1] * 100) / totalBytes);
        return item;
    });
    return topN;
}

function printLanguages(languages) {
    if (languages.length === 0) {
        console.log("No language data found.");
        return;
    }
    languages.forEach(language => {
        console.log(`${language[0]}, ${language[1]}%`);
    });
}

export { 
    getUsername, 
    getLanguagesCount,
    getTopN,
    printLanguages
}
