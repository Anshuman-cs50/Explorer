/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { GithubRepo } from "../types";
import { store } from "./explorerStore";

export function useGithubController() {
  const repos = store.getState().githubRepos;
  const [selectedRepoName, setSelectedRepoName] = useState<string>(repos[0]?.name || "");
  const [activeTab, setActiveTab] = useState<"issues" | "commits">("issues");
  const [issueFilter, setIssueFilter] = useState<"all" | "open" | "closed">("all");

  const selectedRepo = useMemo(() => {
    return repos.find((r) => r.name === selectedRepoName) || repos[0] || null;
  }, [selectedRepoName, repos]);

  const filteredIssues = useMemo(() => {
    if (!selectedRepo) return [];
    if (issueFilter === "all") return selectedRepo.issues;
    return selectedRepo.issues.filter((issue) => issue.status === issueFilter);
  }, [selectedRepo, issueFilter]);

  return {
    repos,
    selectedRepoName,
    setSelectedRepoName,
    selectedRepo,
    activeTab,
    setActiveTab,
    issueFilter,
    setIssueFilter,
    filteredIssues,
  };
}
