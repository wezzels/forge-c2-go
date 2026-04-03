# Kafka 3-Node KRaft Cluster on Kind

**Created:** 2026-04-03
**Updated:** 2026-04-03
**Status:** ✅ WORKING with Strimzi

---

## Summary

3-node Kafka KRaft cluster deployed via **Strimzi Kafka Operator** on Kind (darth/gms namespace).

**Why Strimzi:** Raw StatefulSet approach has fundamental timing issues with KRaft quorum formation. Strimzi handles all the complexity.

---

## Deployment

### Prerequisites

Strimzi Cluster Operator must be installed:
```bash
kubectl apply -f 'https://strimzi.io/install/latest?namespace=gms'
```

### Deploy Kafka

```bash
kubectl apply -f deploy/kafka/kafka-strimzi.yaml -n gms
```

This creates:
- **KafkaNodePool** `kafka-pool`: 3 broker+controller nodes
- **Kafka** `kafka-cluster`: KRaft mode (no ZooKeeper), Kafka 4.2.0

### Verify

```bash
kubectl get pods -n gms -l strimzi.io/cluster=kafka-cluster
# NAME                         READY   STATUS    AGE
# kafka-cluster-kafka-pool-0   1/1     Running   2m
# kafka-cluster-kafka-pool-1   1/1     Running   2m
# kafka-cluster-kafka-pool-2   1/1     Running   2m
```

### Test

```bash
# List topics
kubectl exec kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

# Create topic with RF=3
kubectl exec kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic mytopic --partitions 6 --replication-factor 3

# Describe topic
kubectl exec kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic mytopic

# Console producer
kubectl exec -it kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test

# Console consumer
kubectl exec kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
```

---

## Connection from Outside Kubernetes

The Kafka cluster uses internal listeners. To connect from outside:

### Option 1: Port Forward

```bash
kubectl port-forward -n gms svc/kafka-cluster-kafka-pool-0 9092:9092
```

Then connect to `localhost:9092`.

### Option 2: NodePort (not configured by default)

Strimzi can expose via NodePort or LoadBalancer. See Strimzi docs for external listeners.

---

## Kafka KRaft Mode (No ZooKeeper)

This cluster uses KRaft mode (Kafka's built-in Raft consensus) instead of ZooKeeper:
- **Benefits:** Simpler operations, no ZooKeeper dependency
- **Controller quorum:** All 3 brokers act as controllers in KRaft mode
- **Metadata:** Stored in Kafka itself (__consumer_offsets, __transaction_state)

---

## Issues Encountered (Raw StatefulSet Approach)

### Why Raw StatefulSet Fails

1. **KRaft quorum timing:** Broker-0 times out waiting for brokers 1 and 2 during StatefulSet rollout
2. **Config sync:** Init container patches don't persist to main container filesystem
3. **advertised.listeners:** Defaults to localhost, needs pod FQDN override

Error: `Shutting down because we were unable to register with the controller quorum`

### Why Strimzi Works

Strimzi operator:
1. Creates pods in correct order with proper readiness
2. Uses KRaft mode properly configured
3. Handles listener configuration automatically
4. Manages broker lifecycle and rolling updates

---

## Files

| File | Purpose |
|------|---------|
| `deploy/kafka/kafka-strimzi.yaml` | Strimzi Kafka + KafkaNodePool CR |
| `deploy/kafka/kafka-statefulset.yaml` | Old 1-node StatefulSet (deprecated) |

---

## Operations

### Restart a Broker

```bash
kubectl delete pod kafka-cluster-kafka-pool-1 -n gms
```

### Check Broker IDs

```bash
for i in 0 1 2; do
  kubectl exec kafka-cluster-kafka-pool-$i -n gms -- grep 'broker.id=' /var/lib/kafka/data/meta.properties
done
```

### Check Quorum Status

```bash
kubectl exec kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-metadata.sh --snapshot /var/lib/kafka/data/kraft-log__metadata-0/*/snapshot 2>&1 | head -20
```

### Scale Down (Dangerous!)

Reduce replicas to 1:
```bash
kubectl patch kafkanodepool kafka-pool -n gms -p '{"spec":{"replicas":1}}'
```

⚠️ **Warning:** This can cause data loss if RF > remaining brokers.

### Delete Cluster

```bash
kubectl delete -f deploy/kafka/kafka-strimzi.yaml -n gms
```

This deletes all brokers and data (ephemeral storage).

---

## Monitoring

Strimzi provides JMX metrics. To enable Prometheus scraping:

```yaml
# Add to Kafka spec:
metricsConfig:
  type: jvmPrometheusExporter
```
