import { Octokit } from "octokit";

const octokit = new Octokit();

async function getAllRepos(username) {
    const response = await octokit.rest.repos.listForUser({
        username,
        per_page: 100, 
    });
    return response.data;
}

async function getAllLanguages(username, repo) {
    const response = await octokit.rest.repos.listLanguages({
        owner: username,
        repo
    });
    return response.data;
}

export { 
    getAllRepos,
    getAllLanguages
};
