#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

function readPackageJson() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const content = fs.readFileSync(pkgPath, 'utf8');
  return { pkg: JSON.parse(content) };
}

function bumpVersion(version, type) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z-.]+)?$/.exec(version);
  if (!match) throw new Error(`无法解析当前版本号: ${version}`);
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

function getArgFlag(name, fallback) {
  const found = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (!found) return fallback;
  return found.split('=')[1];
}

function run(cmd, options = {}) {
  return execSync(cmd, { stdio: 'inherit', ...options });
}

function getOutput(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] })
    .toString()
    .trim();
}

function assertCleanWorkingTree() {
  const status = getOutput('git status --porcelain');
  if (status) {
    throw new Error('当前工作区存在未提交的变更，请先提交或暂存后再发布。');
  }
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((resolve) => rl.question(question, (ans) => resolve(ans)));
  rl.close();
  return /^y(es)?$/i.test(answer.trim());
}

async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('用法: node scripts/release.js [--type=patch|minor|major]');
    process.exit(0);
  }

  const bumpType = getArgFlag('type', 'patch');
  if (!['patch', 'minor', 'major'].includes(bumpType)) {
    throw new Error(`不支持的发布类型: ${bumpType}`);
  }

  const branch = getOutput('git rev-parse --abbrev-ref HEAD');
  assertCleanWorkingTree();

  const { pkg } = readPackageJson();
  const current = pkg.version;
  const next = bumpVersion(current, bumpType);

  console.log('将要发布新版本:');
  console.log(`  当前分支: ${branch}`);
  console.log(`  当前版本: ${current}`);
  console.log(`  新版本号: ${next}  (类型: ${bumpType})`);
  console.log('将执行:');
  console.log(`  yarn version --new-version ${next}`);
  console.log('  git push origin HEAD --follow-tags');

  const ok = await confirm('确认发布? [y/N] ');
  if (!ok) {
    console.log('已取消。');
    process.exit(0);
  }

  // 使用 Yarn 自动修改版本、生成提交与 tag
  run(`yarn version --new-version ${next}`);

  // 推送当前分支与 tags
  run('git push origin HEAD --follow-tags');

  console.log(`已发起发布: v${next}。GitHub Actions 将根据 tag 触发自动构建。`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
