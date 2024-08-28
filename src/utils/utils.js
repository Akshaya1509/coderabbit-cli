import { TOP_N } from "../lib/constants.js";

function getUsername(profileUrl) {
    const url = new URL(profileUrl);
    const pathname = url.pathname.replace("/", "");
    if (pathname.length === 0) {
        throw new Error('Invalid profile URL');
    }
    return pathname;
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

function getTopN(languagesCountMap, N = TOP_N) {
    let languagesList = Array.from(languagesCountMap);

    // Sort Languages by Bytes in Descending order
    languagesList.sort((arr1, arr2) => {
        return arr2[1] - arr1[1];
    });
        
    // Get Total Bytes
    const totalBytes = languagesList.reduce((total, item) => {
        return total + item[1];
    }, 0);

    // Calculate percentage of languages
    languagesList = languagesList.slice(0, N);
    const topN = languagesList.map(item => {
        item[1] = Math.round((item[1] * 100) / totalBytes);
        return item;
    });
    return topN;
}

function printLanguages(languages) {
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
