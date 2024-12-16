# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2024-12-11

### Added

- Rich text editor with TipTap
  - Basic text formatting (bold, italic, underline)
  - Headings support
  - Code block with syntax highlighting
  - Language selection for code blocks
- Note management
  - Create, read, update, delete operations
  - Favorite notes functionality
  - Note search capability
- Dark mode support
- Responsive layout foundation
- Docker setup for server
- Monorepo structure with shared types

### Changed

- Migrated from modal-based to page-based note editing
- Improved editor menu UI with better organization
- Enhanced code block UI with language selector

### Technical

- Set up Remix for frontend
- Implemented Bun as runtime
- Added PostgreSQL with Drizzle ORM
- Configured shared TypeScript types
- Added React Query for data fetching

## [0.1.0] - 2024-10-13

Initial development release

### Added

- Basic project structure
- Core note-taking functionality
- Development environment setup

[Unreleased]: https://github.com/username/repo/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/username/repo/releases/tag/v0.1.0
