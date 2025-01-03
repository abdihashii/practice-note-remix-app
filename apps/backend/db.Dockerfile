FROM postgres:17-alpine

HEALTHCHECK --interval=30s --timeout=3s \
    CMD pg_isready -U postgres || exit 1