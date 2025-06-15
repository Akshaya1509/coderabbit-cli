import { getAllRepos, getAllLanguages } from "../utils/github_utils.js";
import { getLanguagesCount, getTopN } from "../utils/utils.js";
import { DEFAULT_TOP_N } from "./constants.js";

const GithubAPI = (function () {
    const getTopNLanguages = async function (username, topN = DEFAULT_TOP_N) {
        const reposData = await getAllRepos(username);    
        const repositoryNames = reposData.map(repository => repository.name);
        
        const promises = []; 
        repositoryNames.forEach(repositoryName => {
            promises.push(getAllLanguages(username, repositoryName));
        });
    
        const results = await Promise.allSettled(promises);

        results.forEach(result => {
            if (result.status === 'rejected') {
                console.warn(`Warning: Failed to fetch languages for a repository. Reason: ${result.reason?.message || result.reason}`);
            }
        });

        const languages = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        
        const languagesCountMap = getLanguagesCount(languages);
        return getTopN(languagesCountMap, topN);
    }    

    return { getTopNLanguages };
})();

export { GithubAPI };
