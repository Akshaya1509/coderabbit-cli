import { TOP_N } from "../lib/constants.js";

function getUsername(profileUrl) {
    const url = new URL(profileUrl);
    const pathname = url.pathname.replace("/", "");
    if (pathname.length === 0) {
        throw new Error('Invalid profile URL');
    }
    return pathname;
}

function getLanguagesCount(languagesMap, languages) {
    for (const [language, bytes] of Object.entries(languages)) {
        if (languagesMap.has(language)) {
            languagesMap.set(
                language, 
                languagesMap.get(language) + bytes
            );
        } else {
            languagesMap.set(language, bytes);
        }
    }
}

function getTopN(languagesMap, N = TOP_N) {
    const languagesList = Array.from(languagesMap);
    // Sort Languages by Bytes in Descending order
    languagesList.sort((arr1, arr2) => {
        return arr2[1] - arr1[1];
    });

    // Get Total Bytes
    const totalBytes = languagesList.reduce((total, item) => {
        return total + item[1];
    }, 0);

    let topN = languagesList.slice(0, N + 1);
    // Calculate percentage of languages
    topN.map(item => {
        item[1] = (Math.floor(item[1] / totalBytes)) * 100;
    });
    return topN;
}

export { 
    getUsername, 
    getLanguagesCount,
    getTopN
}