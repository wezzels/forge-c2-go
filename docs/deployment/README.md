# FORGE-C2 Deployment Guide

## Docker

```bash
# Build image
docker build -t forge-c2:latest .

# Run container
docker run -d \
  --name forge-c2 \
  -p 8080:8080 \
  -v $(pwd)/config.yaml:/app/config.yaml \
  forge-c2:latest
```

## Kubernetes

### Quick Deploy

```bash
kubectl apply -f k8s/forge-c2.yaml
```

### Helm Chart

```bash
# Install
helm install forge-c2 k8s/helm/forge-c2/

# Upgrade
helm upgrade forge-c2 k8s/helm/forge-c2/
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FORGE_CONFIG` | `/app/config.yaml` | Config file path |
| `FORGE_LOG_LEVEL` | `info` | Log level |
| `FORGE_DIS_EXERCISE` | `1` | DIS exercise ID |

## Monitoring

- **Prometheus**: Metrics on `:9090/metrics`
- **Health**: `:8080/health`

## CI/CD

See `.gitlab-ci.yml` for pipeline configuration.
