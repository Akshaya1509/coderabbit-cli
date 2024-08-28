import { getAllRepos, getAllLanguages } from "../utils/github_utils.js";
import { getLanguagesCount, getTopN } from "../utils/utils.js";

const Github = (function () {
    const getTopNLanguages = async (username) => {
        const repos = await getAllRepos(username);
        const languagesMap = new Map();
        
        // create promise for getting langs from each repo - make it all async 
        repos.forEach(async repo => {
            const languages = await getAllLanguages(username, repo);
            // console.log(languages);
            getLanguagesCount(languagesMap, languages);
        });

        const topNLanguages = getTopN(languagesMap);
        return topNLanguages;
    }

    return getTopNLanguages;
})();

export { Github };
