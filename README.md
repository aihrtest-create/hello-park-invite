# Hello Park Invite

This is a Next.js project used to generate and display digital invitations for Hello Park locations globally.

## Deployment Workflow

The project uses a unified deployment strategy driven by GitLab CI:
1. **Develop locally**: Make your changes and commit them.
2. **Push to GitHub**: Just run `git push`.
3. **Mirroring**: GitHub Actions automatically mirrors the pushed code to the `hp-tools/hello-park-invite` GitLab repository.
4. **Deploy**: GitLab CI automatically handles the build and deployment process. The latest version instantly appears on [invite.hello-park.io](https://invite.hello-park.io/).

*Note: The old GitHub Actions deployments to TimeWeb VDS and GitHub Pages have been removed in favor of this new GitLab-centric flow.*

## Getting Started Locally

First, install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
