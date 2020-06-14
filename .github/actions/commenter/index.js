const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

const pull_request_number = github.context.payload.pull_request.number;
const repo = github.context.repo;
const github_token = core.getInput("GITHUB_TOKEN");
const octokit = new github.GitHub(github_token);

async function getCommentID() {
  let { data: comments } = await octokit.issues.listComments({
    ...repo,
    issue_number: pull_request_number,
  });

  let res = comments.filter((comment) => {
    return comment.user.login === "github-actions[bot]";
  });

  return res[0].id;
}

function comment(message) {
  try {
    octokit.issues.updateComment({
      ...repo,
      issue_number: pull_request_number,
      comment_id: getCommentID(),
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

    console.log(testCoverage);

    const commentText = `# PR Report\n ## Bundle Size: ${bundleSize}\n ${testCoverage}`;
    comment(commentText);
  } catch (error) {
    core.setFailed(error.message);
  }
}

createComment();
