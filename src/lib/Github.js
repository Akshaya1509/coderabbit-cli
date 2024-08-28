import { getAllRepos, getAllLanguages } from "../utils/github_utils.js";
import { getLanguagesCount, getTopN } from "../utils/utils.js";

const GithubAPI = (function () {
    const getTopNLanguages = async function (username) {
        const reposData = await getAllRepos(username);    
        const repositoryNames = reposData.map(repository => repository.name);
        
        const promises = []; 
        repositoryNames.forEach(repositoryName => {
            promises.push(getAllLanguages(username, repositoryName));
        });
    
        const results = await Promise.allSettled(promises);
        const languages = results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value);
        
        const languagesCountMap = getLanguagesCount(languages);
        return getTopN(languagesCountMap);
    }    

    return { getTopNLanguages };
})();

export { GithubAPI };
