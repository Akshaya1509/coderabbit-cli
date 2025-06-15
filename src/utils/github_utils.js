import { Octokit } from "octokit";
import "dotenv/config";

if (!process.env.GH_AUTH_TOKEN) {
    throw new Error("GitHub authentication token (GH_AUTH_TOKEN) not found in environment variables. Please ensure it is set.");
}

const octokit = new Octokit({
    auth: process.env.GH_AUTH_TOKEN
});

async function getAllRepos(username) {
    let allRepos = [];
    let page = 1;
    const per_page = 100; // Max allowed by GitHub

    try {
        while (true) {
            const response = await octokit.rest.repos.listForUser({
                username,
                per_page,
                page,
            });

            if (response.data.length === 0) {
                // No more repositories to fetch
                break;
            }

            allRepos = allRepos.concat(response.data);
            page++;
        }
        return allRepos;
    } catch (error) {
        if (error.status === 401) {
            throw new Error("GitHub API Error: Authentication failed. Please check your GH_AUTH_TOKEN.");
        } else if (error.status === 403) {
            throw new Error("GitHub API Error: Rate limit exceeded or access forbidden. Please try again later or check your token permissions.");
        } else if (error.status === 404) {
            throw new Error("GitHub API Error: User not found.");
        } else {
            throw new Error(`GitHub API Error: Failed to fetch repositories. Status: ${error.status || 'unknown'}. Message: ${error.message}`);
        }
    }
}

async function getAllLanguages(username, repositoryName) {
    try {
        const response = await octokit.rest.repos.listLanguages({
            owner: username,
            repo: repositoryName
        });
        return response.data;
    } catch (error) {
        if (error.status === 401) {
            throw new Error("GitHub API Error: Authentication failed. Please check your GH_AUTH_TOKEN.");
        } else if (error.status === 403) {
            throw new Error("GitHub API Error: Rate limit exceeded or access forbidden. Please try again later or check your token permissions.");
        } else if (error.status === 404) {
            throw new Error(`GitHub API Error: Repository "${repositoryName}" not found or languages not accessible.`);
        } else {
            throw new Error(`GitHub API Error: Failed to fetch languages for repository "${repositoryName}". Status: ${error.status || 'unknown'}. Message: ${error.message}`);
        }
    }
}

export { 
    getAllRepos,
    getAllLanguages
};
