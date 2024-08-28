#!/usr/bin/env node
// import yargs from 'yargs';
import { getUsername } from "../src/utils/utils.js";
import { GithubAPI } from "../src/lib/Github.js";
// import { Gitlab } from "../src/lib/Gitlab.js";


async function main() {
    try {
        // TODO: get profile url as cli input
        const profileUrl = 'https://github.com/NatoBoram';
        const username = getUsername(profileUrl);

        const githubTopN = await GithubAPI.getTopNLanguages(username);
        console.log(githubTopN);
        // const gitLabTopN = Gitlab.getTopNLanguages(username);
        
    } catch(err) {
        console.log(err);
    }
}

main();
