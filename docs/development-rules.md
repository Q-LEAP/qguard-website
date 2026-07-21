# Development Rules

These rules apply to every modification made to this repository.

Breaking these rules is considered an incorrect implementation.

---

# Mission

You are maintaining the Q-Guard website.

Your goal is not to redesign it.

Your goal is to preserve it while making the codebase easier to maintain.

Whenever unsure:

Choose the solution that changes the least.

---

# Before Writing Code

Before modifying any file:

1. Read CLAUDE.md.
2. Read all relevant documentation inside /docs.
3. Analyze the existing implementation.
4. Understand why the current code exists.
5. Identify dependencies.

Never start coding immediately.

---

# Planning

For medium or large tasks:

Always explain:

- what you found
- what will change
- which files will be modified
- possible risks

Only then begin implementation.

---

# Minimal Changes

Always modify the minimum amount of code required.

Never rewrite an entire file if only 15 lines need changing.

Never perform cosmetic refactoring unless explicitly requested.

---

# Existing Code First

Before creating:

- CSS
- JavaScript
- Components
- Utilities

Search whether one already exists.

Reuse before creating.

---

# Components

Every reusable section should become reusable.

Avoid duplicated HTML.

Avoid duplicated CSS.

Avoid duplicated JavaScript.

---

# CSS Rules

Prefer:

CSS Variables

Logical properties

Flexbox

Grid

Avoid:

!important

Huge selectors

Deep nesting

Duplicated styles

---

# JavaScript Rules

Use:

Modern ES6+

Small functions

Clear names

Event delegation when appropriate

Avoid:

Global variables

Magic numbers

Duplicate listeners

Anonymous code blocks

---

# Naming

Names must be descriptive.

Good:

heroAnimationDelay

Bad:

delay

Good:

primaryCTAButton

Bad:

button2

---

# Dependencies

Never install a dependency without a real need.

Always ask:

Can this be done with vanilla JavaScript?

If yes:

Do not install anything.

---

# Visual Validation

Every UI modification must preserve:

Spacing

Typography

Colors

Alignment

Animation

Hierarchy

Nothing should visually regress.

---

# Browser Validation

Whenever possible:

Test the page in a browser.

Verify:

Desktop

Tablet

Mobile

Navigation

Buttons

Forms

Animations

---

# Visual Comparison

When modifying an existing page:

Compare it with

https://q-guard.app

until no visual difference is noticeable.

Pixel-perfect fidelity is expected.

---

# Accessibility

Never reduce accessibility.

Forms need labels.

Buttons need accessible names.

Interactive elements need keyboard support.

---

# Performance

Always consider:

Bundle size

Image optimization

Lazy loading

Rendering performance

Layout shifts

Avoid unnecessary JavaScript.

---

# Git

A commit should represent one logical change.

Avoid mixing unrelated modifications.

---

# Comments

Write comments only when they explain WHY.

Do not explain obvious code.

---

# Error Handling

Never silently ignore errors.

Provide meaningful messages.

Fail gracefully.

---

# Completion Checklist

Before considering a task complete:

☐ No regression introduced

☐ Mobile verified

☐ Desktop verified

☐ Tablet verified

☐ Existing design preserved

☐ Existing animations preserved

☐ No duplicated code

☐ No unnecessary dependency

☐ Code remains readable

☐ Documentation updated if necessary

---

# Golden Rule

The website should feel as if it had never left WordPress.

Visitors must not notice the migration.

Developers should notice the improvement.