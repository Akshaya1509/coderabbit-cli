#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getUsername } from "../src/utils/utils.js";
import { GithubAPI } from "../src/lib/GithubAPI.js";
import { printLanguages } from "../src/utils/utils.js";

async function main() {
    try {
        const argv = yargs(hideBin(process.argv))
            .option('profile-url', {
                alias: 'url',
                describe: 'Github profile URL',
                type: 'string',
                demandOption: true
            })
            .check((argv) => {
                if (!argv.profile_url) throw new Error("Profile URL must be passed");
                return true; 
            })
            .argv;

        const profileUrl = argv.profile_url;
        const username = getUsername(profileUrl);

        const githubTopN = await GithubAPI.getTopNLanguages(username);
        printLanguages(githubTopN);
    } catch(err) {
        console.log(err);
    }
}

main();
