/* One-command publish: commit -> rebase on remote -> push -> watch GitHub Actions -> check the live site */

import { spawnSync } from "node:child_process";

const message = process.argv.slice(2).join(" ").trim();
if (!message) {
	console.error('用法: pnpm ship "提交说明"');
	process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function exec(cmd, args, { capture = true } = {}) {
	return spawnSync(cmd, args, {
		encoding: "utf8",
		stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
	});
}

function must(cmd, args, options) {
	const result = exec(cmd, args, options);
	if (result.status !== 0) {
		console.error((result.stderr || result.stdout || "").trim());
		process.exit(result.status ?? 1);
	}
	return (result.stdout || "").trim();
}

must("git", ["add", "-A"]);
const changes = must("git", ["status", "--porcelain"]);
if (changes) {
	console.log(`提交以下改动:\n${changes}`);
	must("git", ["commit", "-m", message]);
} else {
	console.log("本地没有改动，检查是否已有待推送的提交。");
}

const pull = exec("git", ["pull", "--rebase", "origin", "main"]);
if (pull.status !== 0) {
	console.error((pull.stderr || pull.stdout || "").trim());
	console.error("变基冲突: 解决后执行 git rebase --continue，或 git rebase --abort 退回再手动处理。");
	process.exit(pull.status ?? 1);
}

if (must("git", ["rev-list", "--count", "origin/main..HEAD"]) === "0") {
	console.log("远端已包含全部提交，无需推送。");
	process.exit(0);
}

must("git", ["push", "origin", "main"]);

const sha = must("git", ["rev-parse", "HEAD"]);
const remoteUrl = must("git", ["remote", "get-url", "origin"]);
const repo = remoteUrl
	.replace(/\.git$/, "")
	.split(/[/:]/)
	.filter(Boolean)
	.slice(-2)
	.join("/");
const [owner, name] = repo.split("/");
const siteUrl = name.endsWith("github.io")
	? `https://${name}/`
	: `https://${owner}.github.io/${name}/`;

console.log(`\n等待 Actions 为 ${sha.slice(0, 7)} 建构建任务…`);
let runId = "";
for (let attempt = 0; attempt < 20 && !runId; attempt++) {
	const listed = exec("gh", [
		"run",
		"list",
		"--repo",
		repo,
		"--commit",
		sha,
		"--workflow",
		"deploy.yml",
		"--limit",
		"1",
		"--json",
		"databaseId",
	]);
	if (listed.status === 0) {
		try {
			runId = String(JSON.parse(listed.stdout)[0]?.databaseId ?? "");
		} catch {
			runId = "";
		}
	}
	if (!runId) await sleep(5000);
}

if (!runId || runId === "undefined") {
	console.error(`没找到对应的构建任务，请到 https://github.com/${repo}/actions 查看。`);
	process.exit(1);
}

const runUrl = `https://github.com/${repo}/actions/runs/${runId}`;
console.log(`构建任务: ${runUrl}`);

const watch = exec("gh", ["run", "watch", runId, "--repo", repo, "--exit-status", "--interval", "10"], {
	capture: false,
});
if (watch.status !== 0) {
	console.error(`构建或部署失败，线上仍是上一个成功版本。日志: ${runUrl}`);
	process.exit(watch.status ?? 1);
}

console.log("\n校验线上站点…");
let reachable = false;
for (let attempt = 0; attempt < 10 && !reachable; attempt++) {
	try {
		reachable = (await fetch(`${siteUrl}?_=${Date.now()}`, { cache: "no-store" })).status === 200;
	} catch {
		reachable = false;
	}
	if (!reachable) await sleep(6000);
}

console.log(
	reachable
		? `已上线: ${siteUrl}`
		: `部署已成功，线上校验没通过，可能是 CDN 缓存延迟，稍后刷新 ${siteUrl}`
);
