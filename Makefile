run-db-migration:
	docker run --network="host" --rm -i grafana/k6 run --vus 25 --duration 30m - <k6/products.js