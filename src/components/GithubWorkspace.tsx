/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGithubController } from "../logic/githubLogic";
import { Star, GitFork, AlertCircle, CheckCircle2, GitCommit, GitBranch, Github } from "lucide-react";

export function GithubWorkspace() {
  const g = useGithubController();

  if (!g.selectedRepo) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Github className="w-12 h-12 mb-2 animate-pulse" />
        <span>No repositories discovered in active workspaces.</span>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-1/4 flex flex-col gap-2 pr-4 border-r border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mb-2">Connected Repos</span>
        {g.repos.map((repo) => (
          <button
            key={repo.name}
            onClick={() => g.setSelectedRepoName(repo.name)}
            className={`flex flex-col gap-1.5 px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
              g.selectedRepoName === repo.name
                ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-200"
                : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <span className="font-semibold text-sm truncate flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" /> {repo.name}
            </span>
            <span className="text-[10px] text-white/40 line-clamp-1">{repo.description}</span>
            <div className="flex gap-2.5 mt-1.5 text-[9px] text-white/50">
              <span className="flex items-center gap-1"><Star className="w-2.5 h-2.5 text-amber-400" /> {repo.stars}</span>
              <span className="flex items-center gap-1"><GitFork className="w-2.5 h-2.5" /> {repo.forks}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Main Github Pulse View */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Repo Title Bar */}
        <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-3xl border border-white/5">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" /> {g.selectedRepo.name}
            </h3>
            <p className="text-xs text-slate-350 mt-1">{g.selectedRepo.description}</p>
          </div>
          
          {/* Section Tabs */}
          <div className="flex gap-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => g.setActiveTab("issues")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                g.activeTab === "issues" ? "bg-indigo-500/20 text-indigo-100 border border-white/10" : "text-white/60"
              }`}
            >
              Issues
            </button>
            <button
              onClick={() => g.setActiveTab("commits")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                g.activeTab === "commits" ? "bg-indigo-500/20 text-indigo-100 border border-white/10" : "text-white/60"
              }`}
            >
              Commit History
            </button>
          </div>
        </div>

        {/* Tab content viewports */}
        <div className="flex-1 bg-white/5 p-6 rounded-3xl border border-white/10 overflow-y-auto">
          {g.activeTab === "issues" ? (
            /* ISSUES TAB */
            <div className="flex flex-col gap-3">
              {/* Filter sub bar */}
              <div className="flex gap-2 border-b border-white/5 pb-3">
                {["all", "open", "closed"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => g.setIssueFilter(filter as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer border ${
                      g.issueFilter === filter
                        ? "bg-white/15 border-white/20 text-white"
                        : "border-transparent text-white/50 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {g.filteredIssues.map((issue) => (
                <div key={issue.id} className="flex gap-3 items-start p-3 bg-black/10 rounded-xl border border-white/5">
                  {issue.status === "open" ? (
                    <AlertCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-semibold text-white text-xs">{issue.title}</span>
                    <span className="block text-[10px] text-white/40 mt-1">
                      ID: #{issue.id} opened by {issue.author}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    issue.status === "open" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                  }`}>
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* COMMITS TAB */
            <div className="flex flex-col gap-3">
              {g.selectedRepo.commits.map((commit) => (
                <div key={commit.hash} className="flex gap-4 items-start p-3.5 bg-black/10 rounded-xl border border-white/5">
                  <GitCommit className="w-4 h-4 text-indigo-300 mt-1" />
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-bold text-white text-xs leading-normal">{commit.message}</span>
                    <span className="text-[10px] text-slate-400">
                      by <strong>{commit.author}</strong> - {commit.date}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] bg-white/10 hover:bg-white/15 text-white/80 px-2 py-1 rounded border border-white/10 select-none">
                    {commit.hash}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GithubWorkspace;
