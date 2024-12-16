# Version Control Guide

Quick reference guide for managing versions and changelog in this project.

## Semantic Versioning (SemVer)

### Version Format: `MAJOR.MINOR.PATCH` (e.g., 1.2.3)

When to increment each number:

- **MAJOR (1.x.x)**: Breaking changes

  ```
  - Changing authentication system
  - Modifying database schema incompatibly
  - Changing API endpoints structure
  ```

- **MINOR (x.2.x)**: New features (backwards compatible)

  ```
  - Adding tags feature
  - Adding new editor capabilities
  - Adding new API endpoints
  ```

- **PATCH (x.x.3)**: Bug fixes (backwards compatible)
  ```
  - Fixing editor crashes
  - Correcting API response formats
  - Fixing UI glitches
  ```

## Changelog Usage

### 1. Adding New Changes

Always add to the `[Unreleased]` section first:

```markdown
## [Unreleased]

### Added

- New feature description

### Fixed

- Bug fix description
```

### 2. Categories to Use

- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security updates

### 3. Quick Examples

Good changelog entries:

```markdown
### Added

- Code block language selection with 20+ languages
- Auto-save feature with 3-second delay
- Search with PostgreSQL full-text support

### Fixed

- Editor crash when pasting large content
- Incorrect timestamp display in notes list
```

Bad changelog entries:

```markdown
### Added

- Updated code
- Fixed stuff
- Made changes
```

### 4. Release Process

1. When ready to release:

   ```markdown
   ## [Unreleased]

   ## [1.1.0] - 2024-12-11

   ### Added

   - Feature A
   - Feature B
   ```

2. Update version numbers:
   ```bash
   bun version minor  # For new features (1.1.0)
   bun version patch  # For bug fixes (1.0.1)
   bun version major  # For breaking changes (2.0.0)
   ```

## Quick Reference

### Common Scenarios

1. **Adding a new feature**:

   - Add to `[Unreleased]` under "Added"
   - Use MINOR version bump
   - Be specific about what was added

2. **Fixing a bug**:

   - Add to `[Unreleased]` under "Fixed"
   - Use PATCH version bump
   - Describe what was fixed and how

3. **Making breaking changes**:
   - Add to `[Unreleased]` under "Changed"
   - Use MAJOR version bump
   - Clearly explain what breaks and why

### Current Project Versions

- Development: 0.x.x (Pre-1.0)
- Production: Start at 1.0.0
- Breaking changes: Jump to 2.0.0

### Tips

1. Write changelog entries immediately after making changes
2. Be specific but concise
3. Think about the end user reading it
4. Include relevant ticket/issue numbers
5. Group related changes together

### Don't Forget

- Update both package.json and CHANGELOG.md
- Create git tags for releases
- Keep unreleased changes at the top
- Date all releases
- Link to compare views at bottom of changelog
