## Features

### Core Features

- [x] CRUD
- [x] Excerpt
- [x] Page instead of modal for viewing notes
- [x] Page instead of modal for creating/editing notes
- [x] Rich text editor

### Editor Features

- [ ] Checkbox for todo items
  - [ ] TipTap checkbox extension
  - [ ] Toggle functionality
  - [ ] Theme-matched styling
- [ ] Basic formatting
  - [ ] Bold, Italic, Underline
  - [ ] Headings
  - [ ] Lists (ordered & unordered)
  - [ ] Code blocks
- [ ] Advanced formatting
  - [ ] Tables
  - [ ] Image support
  - [ ] Links
  - [ ] Blockquotes

### Organization Features

- [ ] Filter options
  - [ ] Filter by date
  - [ ] Filter by tags
  - [ ] Filter by collections
- [ ] Sort options
  - [ ] Sort by date
  - [ ] Sort by title
  - [ ] Sort by last modified
- [x] Favorites
- [ ] Manual tags
  - [ ] Tag schema & API
  - [ ] Tag autocomplete
  - [ ] Bulk tag management
- [ ] Collections
  - [ ] Collection schema & API
  - [ ] UI for management
  - [ ] Drag-and-drop organization

### Security Features

- [ ] Auth
  - [ ] JWT implementation
  - [ ] Refresh token rotation
  - [ ] Password reset flow
  - [ ] Email verification
- [ ] Secured user data
  - [ ] Note encryption at rest
  - [ ] User data isolation
  - [ ] Rate limiting
  - [ ] Input sanitization

### Search Features

- [x] Search
- [ ] Use postgres full text search with indexes
  - [ ] Search index setup
  - [ ] Search suggestions
  - [ ] Search filters integration
- [ ] Fuzzy search

### UI/UX Features

- [x] Dark theme
- [ ] Responsive design
  - [ ] Mobile-friendly layout
  - [ ] Touch interactions
- [ ] Spell check
- [ ] Accessibility
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Screen reader support

## Engineering

### Development Setup

- [x] Monorepo setup
- [x] Docker setup for server
- [ ] ESLint setup
  - [ ] Custom rules
  - [ ] Editor integration
  - [ ] Pre-commit hooks

### Testing Strategy

- [ ] Unit testing for the server code
  - [ ] API route tests
  - [ ] Service layer tests
- [ ] Integration testing for the server code
- [ ] End to end testing for the client code
  - [ ] Critical user flows
    - [ ] Login
    - [ ] Register
    - [ ] Forgot password
    - [ ] Reset password
    - [ ] Verify email
    - [ ] Logout
    - [ ] Editor functionality
      - [ ] Create note
      - [ ] Edit note
      - [ ] Delete note
      - [ ] Search
      - [ ] Favorites
      - [ ] Tags
      - [ ] Collections

### DevOps

- [ ] Deployment
  - [ ] CI/CD with GitHub Actions
  - [ ] Automated testing
  - [ ] Production deployment
- [ ] Docker setup for client
- [ ] Monitoring
  - [ ] Error tracking
  - [ ] Performance monitoring
  - [ ] Usage analytics
- [ ] Backup strategy
  - [ ] Automated backups
  - [ ] Backup testing
  - [ ] Recovery procedures

## Performance Optimizations

### Frontend Optimization

- [ ] Editor optimization
  - [ ] Large document handling
  - [ ] Lazy loading for long notes
  - [ ] Debounced save
- [ ] Asset optimization
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Bundle size optimization

### Backend Optimization

- [ ] API optimization
  - [ ] Query optimization
  - [ ] Response caching
  - [ ] Pagination improvements
- [ ] Error handling
  - [ ] Global error boundary
  - [ ] API error handling
  - [ ] Error logging system
