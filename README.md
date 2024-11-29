## Development Setup

1. Create a GitHub Personal Access Token with:
   - `read:packages` scope for installing
   - `write:packages` scope for publishing
2. Add it to your environment:

   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

3. Authenticate with GitHub Packages:

   ```bash
   npm login --scope=@notes-app --registry=https://npm.pkg.github.com
   # Use your GitHub username
   # Use your personal access token as password
   # Use your GitHub email
   ```

4. Install dependencies:
   ```bash
   bun install
   ```
