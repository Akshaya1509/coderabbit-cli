#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getUsername } from "../src/utils/utils.js";
import { GithubAPI } from "../src/lib/GithubAPI.js";
import { printLanguages } from "../src/utils/utils.js";
import { DEFAULT_TOP_N } from "../src/lib/constants.js";

async function main() {
    try {
        const argv = yargs(hideBin(process.argv))
            .option('profile_url', {
                alias: ['url', 'p'],
                describe: 'GitHub profile URL of the user',
                type: 'string',
                demandOption: true
            })
            .option('top_n', {
                alias: 'n',
                describe: 'Number of top languages to display',
                type: 'number',
                default: DEFAULT_TOP_N
            })
            .check((argv) => {
                if (!argv.profile_url) throw new Error("Profile URL must be passed");
                if (argv.top_n !== undefined && (typeof argv.top_n !== 'number' || argv.top_n <= 0)) {
                    throw new Error("top_n must be a positive number.");
                }
                return true; 
            })
            .help()
            .alias('help', 'h')
            .argv;

        const profileUrl = argv.profile_url;
        const topN = argv.top_n;
        const username = getUsername(profileUrl); // Validation now primarily in getUsername

        console.log(`Fetching repository data and analyzing top ${topN} languages...`);

        const githubTopN = await GithubAPI.getTopNLanguages(username, topN);

        console.log(`\nAnalysis complete (Top ${topN} languages):`); // Adding a newline for better separation
        printLanguages(githubTopN);
    } catch(err) {
        // Check for the specific error message from getUsername or yargs
        if (err.message && (err.message.includes('Invalid GitHub profile URL format') || err.message.includes('Profile URL must be passed'))) {
            console.error(`Error: ${err.message}`);
        } else if (err.message && (err.message.includes('GH_AUTH_TOKEN') || err.message.includes('Authentication failed'))) {
            console.error(`Error: GitHub authentication failed. Please ensure your GH_AUTH_TOKEN is correctly set in your environment variables.`);
        } else if (err.message && err.message.includes('Rate limit exceeded')) {
            console.error(`Error: GitHub API rate limit exceeded. Please try again later or check your token permissions.`);
        } else if (err.message && err.message.includes('User not found')) {
            console.error(`Error: The specified GitHub user was not found.`);
        } else if (err.message && err.message.includes('Repository not found')) {
            console.error(`Error: A repository was not found or languages could not be accessed. Check repository names and permissions.`);
        } else if (err.message && err.message.startsWith('GitHub API Error:')) { // Catch other specific API errors
            console.error(err.message);
        }
         else {
            console.error(`An unexpected error occurred: ${err.message || err}`);
        }
        process.exit(1);
    }
}

main();
