## Development Setup

1. Create a GitHub Personal Access Token with `read:packages` scope
2. Add it to your environment:
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```
3. Create `.npmrc` in your home directory:
   ```
   @notes-app:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
