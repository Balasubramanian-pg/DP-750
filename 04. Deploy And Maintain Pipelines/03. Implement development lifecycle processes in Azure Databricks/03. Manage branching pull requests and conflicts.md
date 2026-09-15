# Manage branching pull requests and conflicts

## Manage Branching and Pull Requests

Collaborative development requires isolation. When multiple engineers modify notebooks simultaneously, unstructured changes lead to conflicts and broken pipelines. Branching and pull requests provide the structure needed to integrate work safely.

[![Diagram showing how to manage branching, pull requests and conflicts.](media/3-manage-branching-pull-requests-conflicts.png)](media/3-manage-branching-pull-requests-conflicts.png#lightbox "media/3-manage-branching-pull-requests-conflicts.png#lightbox")

## The Visual Git Client

Azure Databricks embeds a visual Git client directly into the workspace. This eliminates context switching between external tools and the development environment.

*   **Branching:** Create isolated lines of development for features or fixes.
*   **Committing:** Save snapshots of changes with descriptive messages.
*   **Merging:** Integrate approved changes back into shared branches.

> **Info:** All standard Git operations are available through the UI. Complex workflows can also be managed via the API for automation.

## Branching Strategy

Isolation is the primary goal of branching.

*   **Feature Branches:** Create a new branch for each distinct task. This keeps changes atomic and reviewable.
*   **Short-Lived Branches:** Merge frequently to reduce drift from the main branch.
*   **Protected Main Branch:** Restrict direct commits to the main branch. All changes must enter via pull request.

> **Tip:** Name branches descriptively (e.g., `feature/customer-churn-model` or `fix/schema-validation-error`). Clear naming helps teammates understand the purpose of a branch at a glance.

## Pull Request Workflow

Pull requests (PRs) are the gatekeepers of code quality. They transform integration from a mechanical merge into a reviewed process.

1.  **Initiate PR:** Open a pull request from your feature branch to the target branch (usually `main`).
2.  **Code Review:** Teammates examine the changes for logic errors, style consistency, and potential side effects.
3.  **Automated Checks:** CI/CD pipelines run tests against the PR branch to validate functionality.
4.  **Merge:** Once approved and tested, merge the changes into the target branch.

> **Note:** A pull request is not just a merge request. It is a discussion forum where design decisions are documented and knowledge is shared across the team.

## Conflict Resolution

Conflicts occur when two branches modify the same lines of code. The visual Git client provides an interface to resolve these disputes.

*   **Identify Conflicts:** The system flags files with overlapping changes.
*   **Review Differences:** Compare local changes against incoming changes.
*   **Select Resolution:** Choose which version to keep, or manually edit to combine both.
*   **Commit Resolution:** Save the resolved file and complete the merge.

> **Warning:** Resolve conflicts immediately. Delayed resolution increases the risk of introducing logical errors as the codebase continues to evolve around the conflicting files.

# Create and Manage Branches

Feature branches isolate development. They allow you to build and test changes without impacting the shared codebase. This isolation is the foundation of safe collaboration.

## Creating a Branch

1.  **Open Git Dialog:** Select the branch button next to your notebook name.
2.  **Initiate Creation:** Choose **Create branch**.
3.  **Configure:**
    *   Enter a descriptive name.
    *   Select the source branch (typically `main`).

[![Screenshot of the create branch dialog.](media/3-create-branch.png)](media/3-create-branch.png#lightbox "media/3-create-branch.png#lightbox")

> **Info:** A new branch starts as an exact copy of the source branch. All subsequent commits diverge from this point, creating a separate history for your changes.

## Naming Conventions

Consistent naming makes branch purpose immediately clear.

*   `feature/feature-name`: New functionality or enhancements.
*   `bugfix/issue-description`: Corrections to existing logic.
*   `users/username/description`: Personal experimental work.

> **Tip:** Avoid generic names like `test` or `update`. Descriptive names help teammates understand the scope of a branch during code review and conflict resolution.

## Switching Branches

Branch switching in Databricks has specific behaviors regarding local state.

*   **Uncommitted Changes:** If changes do not conflict with the target branch, they carry over. This can be useful for moving work between branches but risky if unintended.
*   **Discard Before Switch:** If you do not intend to move local changes, discard them before switching branches.

> **Important:** Switching branches may delete workspace assets that exist on the current branch but not on the target. Verify asset existence on the target branch before switching, especially if notebooks are shared or bookmarked by other team members. This prevents broken links and lost context.

# Commit and Push Changes

Committing creates a snapshot of your work. It records the state of modified files in the branch history, providing a reversible checkpoint. Pushing synchronizes these snapshots with the remote repository, making them visible to the team.

## The Commit Workflow

1.  **Open Git Dialog:** Access the interface from the notebook toolbar or workspace browser.
2.  **Review Changes:** Examine the list of modified files. Use visual diffs to verify the accuracy of your edits.
3.  **Write Message:** Enter a descriptive commit message explaining *what* changed and *why*.
4.  **Execute:** Select **Commit & Push** to save locally and sync remotely.

> **Info:** Visual diffs are critical for notebooks. They allow you to see exactly which cells were added, removed, or modified, preventing accidental inclusion of debug code or temporary outputs.

## Protected Branches

Direct commits to protected branches like `main` are typically restricted.

*   **Feature Branch First:** Create a dedicated branch for your changes.
*   **Pull Request:** Use your Git provider’s interface to request a merge.
*   **Review Gate:** Teammates validate the changes before integration.

> **Tip:** A good commit message is imperative in tone (e.g., "Add customer churn validation" rather than "Added validation"). It should stand alone as a summary of the change without requiring context from the code itself.

## Notebook Outputs and Version Control

The treatment of notebook outputs depends on the file format.

*   **Source Formats (`.py`, `.scala`, `.sql`, `.r`):** Outputs are excluded from commits by default. This keeps the repository clean and focused on logic.
*   **IPYNB Format:** Includes outputs in the versioned file. Use this only when capturing specific results for documentation or reproducibility.

> **Note:** Versioning outputs increases file size and can cause frequent merge conflicts due to timestamp or execution ID changes. Prefer source formats for standard development and reserve IPYNB for final reports or tutorials.

# Work with Pull Requests

Pull requests are the mechanism for code review. They decouple the act of writing code from the act of integrating it. While Azure Databricks handles the local Git operations, the pull request lifecycle resides in your Git provider’s interface (GitHub, Azure DevOps, GitLab, or Bitbucket).

## The Collaboration Workflow

1.  **Clone:** Establish the local repository in your workspace.
2.  **Branch:** Create a feature branch from `main`.
3.  **Develop:** Modify notebooks and files.
4.  **Push:** Commit and sync changes to the remote.
5.  **Request:** Open a pull request via the Git provider’s website.
6.  **Review:** Address team feedback and iterate.
7.  **Merge:** Integrate the approved changes into the deployment branch.

> **Info:** The pull request is not a Databricks feature; it is a Git platform feature. Databricks provides the code; the platform provides the governance.

## Isolation Principle

Each developer must work on their own branch. Sharing a single Git folder among multiple users for active development creates race conditions.

*   **Conflict Risk:** If two users push to the same folder, one user’s branch switch can overwrite or delete the other’s uncommitted work.
*   **State Corruption:** Shared folders lack the isolation needed for parallel development.

> **Tip:** Treat your Git folder as a personal workspace. The shared repository is the coordination point, not the development surface.

## Syncing After Merge

Once a pull request merges, the remote branch updates. Your local workspace remains behind until you explicitly pull.

*   **Pull Updates:** Fetch the merged changes to align your local state with the remote.
*   **Verify Integrity:** Ensure that the merged code does not break your local environment.

---

# Resolve Merge Conflicts

Conflicts occur when Git cannot automatically reconcile differences between branches. This happens during pulls, merges, or rebases when multiple users modify the same lines of code.

## Resolution Strategies

The Git folders UI identifies conflicting files and offers two paths:

### 1. Automated Resolution
Use this when one set of changes is clearly superior or when the conflict is trivial.

*   **Keep Current:** Discard incoming changes and retain your local version.
*   **Take Incoming:** Discard your local changes and accept the remote version.

> **Note:** These options apply to the entire file. They are fast but blunt instruments. Use them only when you are certain that one side’s changes are complete and correct.

### 2. Manual Resolution
Required for complex conflicts where logic from both sides must be preserved.

Git marks conflicting sections with markers:

```
<<<<<<< HEAD
Your current changes
=======
Incoming changes
>>>>>>> branch-name
```

*   **Edit:** Remove the markers and combine the code logically.
*   **Validate:** Ensure the resulting code is syntactically correct and functionally sound.
*   **Mark Resolved:** Signal to Git that the conflict is handled.

After resolving all files, select **Continue Merge** or **Continue Rebase**. If the resolution introduces errors, select **Abort** to revert to the pre-conflict state.

> **Tip:** Pull frequently. Small, incremental merges are easier to resolve than large, divergent ones. Regular synchronization keeps the conflict surface area small.

With these practices, you move from individual coding to coordinated engineering. The next step is integrating these workflows into CI/CD pipelines for automated deployment across environments.
