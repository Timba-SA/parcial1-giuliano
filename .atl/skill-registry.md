# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When creating a pull request | branch-pr | ~/.config/opencode/skills/branch-pr/SKILL.md |
| When writing Go tests | go-testing | ~/.config/opencode/skills/go-testing/SKILL.md |
| When creating a GitHub issue | issue-creation | ~/.config/opencode/skills/issue-creation/SKILL.md |
| When user says "judgment day" | judgment-day | ~/.config/opencode/skills/judgment-day/SKILL.md |
| When user asks to create a new skill | skill-creator | ~/.config/opencode/skills/skill-creator/SKILL.md |

## Compact Rules

### branch-pr
- Use the issue-first enforcement system.
- Ensure the PR has a valid summary.

### go-testing
- Use Gentleman.Dots testing patterns.
- Leverage teatest for Bubbletea TUI testing.

### issue-creation
- Follow issue-first enforcement system.
- Include reproduction steps or clear requirements.

### judgment-day
- Run blind adversarial review simultaneously.
- Synthesize findings and fix iteratively.

### skill-creator
- Create skills following the Agent Skills spec.
- Define actionable triggers and compact rules.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| None | None | No convention files found. |