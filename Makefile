# FORGE-C2 Makefile
.PHONY: all build test vet fmt lint docker docker-push kind-deploy clean

# Variables
IMAGE_NAME := ghcr.io/stsgym/forge-c2
VERSION := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_DATE := $(shell date -u +%Y-%m-%dT%H:%M:%SZ)

# Go parameters
GOCMD := go
GOBUILD := $(GOCMD) build
GOTEST := $(GOCMD) test
GOVET := $(GOCMD) vet
GOFMT := gofmt
GOMOD := $(GOCMD) mod

# Build flags
LDFLAGS := -s -w \
	-X main.Version=$(VERSION) \
	-X main.Commit=$(COMMIT) \
	-X main.BuildDate=$(BUILD_DATE)

# Directories
K8S_DIR := k8s
BUILD_DIR := build

all: test build

## build: Build the binary
build:
	@echo "Building FORGE-C2 $(VERSION)..."
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=1 $(GOBUILD) -ldflags="$(LDFLAGS)" -o $(BUILD_DIR)/forge-c2 ./cmd/forge-c2

## test: Run all tests
test:
	@echo "Running tests..."
	$(GOTEST) -v -race -cover ./...

## test/short: Run tests without race detector
test/short:
	$(GOTEST) -v -short ./...

## test/jreap: Run J-series tests only
test/jreap:
	$(GOTEST) -v ./jreap/...

## test/mdpa: Run MDPAF tests only
test/mdpa:
	$(GOTEST) -v ./mdpa/...

## test/internal: Run internal package tests
test/internal:
	$(GOTEST) -v ./internal/...

## vet: Run go vet
vet:
	@echo "Running go vet..."
	$(GOVET) ./...

## fmt: Format code
fmt:
	@echo "Formatting code..."
	$(GOFMT) -w .
	$(GOFMT) -w ./cmd
	$(GOFMT) -w ./internal
	$(GOFMT) -w ./jreap
	$(GOFMT) -w ./mdpa

## check: Run format check
check:
	@echo "Checking formatting..."
	@diff=$$($(GOFMT) -d .); \
	if [ -n "$$diff" ]; then \
		echo "Formatting issues found:"; \
		echo "$$diff"; \
		exit 1; \
	fi
	@echo "Formatting OK"

## docker: Build Docker image
docker:
	@echo "Building Docker image..."
	docker build \
		--build-arg VERSION=$(VERSION) \
		--build-arg COMMIT=$(COMMIT) \
		--build-arg DATE=$(BUILD_DATE) \
		-t $(IMAGE_NAME):$(VERSION) \
		-t $(IMAGE_NAME):latest \
		-t $(IMAGE_NAME):$(COMMIT) \
		.

## docker-push: Push Docker image
docker-push: docker
	@echo "Pushing Docker image..."
	docker push $(IMAGE_NAME):$(VERSION)
	docker push $(IMAGE_NAME):latest
	docker push $(IMAGE_NAME):$(COMMIT)

## kind-load: Load Docker image into Kind cluster
kind-load: docker
	@echo "Loading image into Kind..."
	kind load docker-image $(IMAGE_NAME):$(VERSION) --name forge-c2

## kind-deploy: Deploy to Kind cluster
kind-deploy: kind-load
	@echo "Deploying to Kind..."
	kubectl apply -f $(K8S_DIR)/namespace.yaml
	kubectl apply -f $(K8S_DIR)/config.yaml
	kubectl apply -f $(K8S_DIR)/deployment.yaml
	kubectl apply -f $(K8S_DIR)/service.yaml
	kubectl apply -f $(K8S_DIR)/hpa.yaml
	kubectl apply -f $(K8S_DIR)/monitoring.yaml
	kubectl rollout status deployment/forge-c2 -n forge-c2 --timeout=120s

## kind-delete: Delete Kind deployment
kind-delete:
	@echo "Deleting from Kind..."
	kubectl delete -f $(K8S_DIR)/monitoring.yaml --ignore-not-found=true
	kubectl delete -f $(K8S_DIR)/hpa.yaml --ignore-not-found=true
	kubectl delete -f $(K8S_DIR)/service.yaml --ignore-not-found=true
	kubectl delete -f $(K8S_DIR)/deployment.yaml --ignore-not-found=true
	kubectl delete -f $(K8S_DIR)/config.yaml --ignore-not-found=true
	kubectl delete namespace forge-c2 --ignore-not-found=true

## kind-restart: Restart Kind deployment
kind-restart: kind-delete kind-deploy

## clean: Clean build artifacts
clean:
	@echo "Cleaning..."
	rm -rf $(BUILD_DIR)
	docker rmi $(IMAGE_NAME):$(VERSION) $(IMAGE_NAME):latest $(IMAGE_NAME):$(COMMIT) 2>/dev/null || true

## kind-create: Create Kind cluster
kind-create:
	@echo "Creating Kind cluster..."
	kind create cluster --config $(K8S_DIR)/kind-config.yaml --name forge-c2

## kind-destroy: Destroy Kind cluster
kind-destroy:
	@echo "Destroying Kind cluster..."
	kind delete cluster --name forge-c2

## help: Show this help
help:
	@echo "FORGE-C2 Makefile"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
