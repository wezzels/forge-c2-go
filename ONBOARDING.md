

---

## Kafka 3-Node KRaft Cluster (2026-04-03)

### Status: ✅ WORKING

3-node Kafka KRaft cluster deployed via **Strimzi Kafka Operator** on Kind (darth/gms namespace).

### Why Strimzi?

Raw StatefulSet approach has fundamental timing issues with KRaft quorum formation:
- Broker-0 can't form quorum alone and shuts down
- Kubernetes StatefulSet creates pods sequentially, even with Parallel podManagementPolicy
- Config patching in init containers doesn't persist to main containers

Strimzi handles all the complexity: proper pod ordering, KRaft configuration, listener management.

### Deploy

Strimzi operator already installed on darth. To deploy Kafka:

```bash
kubectl apply -f deploy/kafka/kafka-strimzi.yaml -n gms
```

This creates:
- **KafkaNodePool** `kafka-pool`: 3 broker+controller nodes
- **Kafka** `kafka-cluster`: KRaft mode, Kafka 4.2.0

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
# Create topic with RF=3
kubectl exec kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic test --partitions 6 --replication-factor 3

# Verify replication
kubectl exec kafka-cluster-kafka-pool-0 -n gms -- /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic test
```

### Files

| File | Purpose |
|------|---------|
| deploy/kafka/kafka-strimzi.yaml | Strimzi Kafka + KafkaNodePool CR |
| deploy/kafka/kafka-statefulset.yaml | Old 1-node StatefulSet (deprecated) |
| deploy/kafka/KAFKA-CLUSTER.md | Full operations guide |

### Raw StatefulSet Issues Documented

See `deploy/kafka/KAFKA-CLUSTER.md` for full details on why raw StatefulSet fails and how Strimzi solves it.

---

*Last Updated: 2026-04-03 14:45 UTC*
