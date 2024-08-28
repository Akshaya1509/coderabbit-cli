#!/usr/bin/env node
// import yargs from 'yargs';
import { getUsername } from "../src/utils/utils.js";
import { Github } from "../src/lib/Github.js";
// import { Gitlab } from "../src/lib/Gitlab.js";
import { TopNLanguages } from '../src/lib/TopNLanguages.js';

async function main() {
    try {
        // TODO: get profile url as cli input
        const profileUrl = 'https://github.com/NatoBoram';
        const username = getUsername(profileUrl);

        const githubTopN = Github.getTopNLanguages(username);
        // const gitLabTopN = Gitlab.getTopNLanguages(username);
        let results = Promise.all(
            githubTopN, 
            gitLabTopN
        );
        
        // return TopNLanguages.mergeLists(
        //     githubTopN,
        //     gitLabTopN,
        // );
    } catch(err) {
        console.log(err);
    }
}

main();
