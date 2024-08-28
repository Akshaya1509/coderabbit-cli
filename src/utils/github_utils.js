import { Octokit } from "octokit";
import "dotenv/config";

const octokit = new Octokit({
    auth: process.env.GH_AUTH_TOKEN
});

async function getAllRepos(username) {
    const response = await octokit.rest.repos.listForUser({
        username,
        per_page: 100, 
    });
    return response.data;
}

async function getAllLanguages(username, repositoryName) {
    const response = await octokit.rest.repos.listLanguages({
        owner: username,
        repo: repositoryName
    });
    return response.data;
}

export { 
    getAllRepos,
    getAllLanguages
};
