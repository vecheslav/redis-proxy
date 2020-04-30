start:
	docker-compose up proxy
.PHONY: start

test:
	docker-compose run --rm proxy yarn run test
.PHONY: test