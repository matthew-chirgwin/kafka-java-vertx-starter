const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

function comment(message) {
  try {
    const github_token = core.getInput("GITHUB_TOKEN");

    const pull_request_number = github.context.payload.pull_request.number;
    const repo = github.context.repo;

    const octokit = new github.GitHub(github_token);
    octokit.issues.createComment({
      ...repo,
      issue_number: pull_request_number,
      body: message,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function createComment() {
  try {
    const bundleSize = core.getInput("BUNDLE_SIZE");
    const testCoverage = core.getInput("TEST_COVERAGE");

    const commentText = `# PR Report\n ## Bundle Size: ${bundleSize}\n ${testCoverage}`;
    comment(commentText);
  } catch (error) {
    core.setFailed(error.message);
  }
}

createComment();
