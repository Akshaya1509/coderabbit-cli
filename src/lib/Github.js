import { getAllRepos, getAllLanguages } from "../utils/github_utils.js";
import { getLanguagesCount, getTopN } from "../utils/utils.js";

const GithubAPI = (function () {
    const getTopNLanguages = async function (username) {
        const reposData = await getAllRepos(username);    
        const repos = reposData.map(repository => repository.name);
        
        const promises = []; 
        repos.forEach(repositoryName => {
            promises.push(getAllLanguages(username, repositoryName));
        });
    
        const results = await Promise.allSettled(promises);
        const languages = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        
        const languagesMap = new Map();
        getLanguagesCount(languagesMap, languages);
    
        const topNLanguages = getTopN(languagesMap);
        return topNLanguages;
    }    

    return { getTopNLanguages };
})();

export { GithubAPI };