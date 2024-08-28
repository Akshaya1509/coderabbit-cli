# coderabbit-cli

CLI takes Github Profile URL as an input and prints the top 5 languages used by the user in his public repositories.

### Example Usage 
1. Clone the repo and cd into the repo.
2. npm install
3. npm install -g .
4. Create `.env` file with `GH_AUTH_TOKEN=<your personal access token>`
5. `top-5-langs --profile_url https://github.com/NatoBoram`


### Sample Output
```
coderabbit-cli % top-5-langs --profile_url https://github.com/NatoBoram
Java, 96%
HTML, 2%
TypeScript, 1%
Python, 0%
XSLT, 0%
```
