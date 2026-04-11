# Build stage
FROM golang:1.22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build arguments
ARG VERSION=latest
ARG COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
ARG DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Build the binary
ENV CGO_ENABLED=1
ENV GOOS=linux
ENV GOARCH=amd64

RUN go build \
    -ldflags="-s -w \
        -X main.Version=${VERSION} \
        -X main.Commit=${COMMIT} \
        -X main.BuildDate=${DATE}" \
    -o /app/forge-c2 \
    ./cmd/forge-c2

# Runtime stage
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1000 -S forge && \
    adduser -u 1000 -S forge -G forge

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/forge-c2 .

# Copy entrypoint script
COPY --from=builder /build/scripts/entrypoint.sh .

# Set permissions
RUN chown -R forge:forge /app && \
    chmod +x entrypoint.sh

# Environment
ENV USER=forge
ENV UID=1000
ENV GID=1000
ENV GOMAXPROCS=4
ENV GOTRACEBACK=single
ENV GIN_MODE=release

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health/live || exit 1

# Expose ports
EXPOSE 8080 9090 9091

# Use dumb-init for signal handling
ENTRYPOINT ["/app/entrypoint.sh"]

# Default command
CMD ["serve"]
