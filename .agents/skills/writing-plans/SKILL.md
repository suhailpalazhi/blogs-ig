---
name: writing-plans
description: Writes comprehensive implementation plans for a multi-step task based on existing requirements or specs. Use when preparing to implement a validated design or complex feature.
---

# Writing Implementation Plans

## When to use this skill
- When you have a validated design and need to break it down into tasks.
- When the user asks for an "implementation plan" or step-by-step development guide.
- Before starting to write code for a multi-step feature.

## Workflow
- [ ] Review the design document or requirements.
- [ ] Break down the work into bite-sized tasks (2-5 minutes per action).
- [ ] Define the exact files to create or modify for each task.
- [ ] Write the specific test code and implementation code for each step.
- [ ] Outline the commands to run for testing.
- [ ] Save the plan to `docs/plans/YYYY-MM-DD-<feature>.md`.

## Instructions
Write comprehensive implementation plans assuming the executor needs explicit, step-by-step guidance. Document which files to touch, what code to write, and how to verify it. Use a Test-Driven Development (TDD) approach where appropriate.

### Plan Document Template
Every plan must start with a descriptive header and break down into granular tasks.

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]

**Architecture:** [Brief description of the approach]

---

### Task N: [Component Name]

**Files:**
- Create: `path/to/new_file.ext`
- Modify: `path/to/existing_file.ext`
- Test: `tests/path/to/test_file.ext`

**Step 1: Write the failing test**
(Provide exact test code here)

**Step 2: Run test to verify it fails**
Run: `[test command]`
Expected: FAIL due to [reason]

**Step 3: Write minimal implementation**
(Provide exact implementation code here)

**Step 4: Run test to verify it passes**
Run: `[test command]`
Expected: PASS
```

## Key Principles
* **Bite-Sized Granularity**: Each step should be one atomic action.
* **Exact Paths and Code**: Provide exact file paths and complete code snippets.
* **DRY & YAGNI**: Don't over-engineer. Follow "Do Not Repeat Yourself" and "You Aren't Gonna Need It".
