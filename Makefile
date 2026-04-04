.PHONY: dev dev-build prod prod-build down migrate db-seed db-push studio studio-stop studio-status frontend frontend-build frontend-install status

dev:
	docker compose --env-file ./backend/.env.docker up -d
	docker system prune -f

dev-build:
	docker compose --env-file ./backend/.env.docker up --build -d
	docker system prune -f

config:
	docker compose config

prod:
	docker compose -f docker-compose.prod.yml --env-file ./backend/.env.prod.docker up -d
	docker system prune -f

prod-build:
	docker compose -f docker-compose.prod.yml --env-file ./backend/.env.prod.docker up --build -d
	docker system prune -f

down:
	docker compose down

migrate:
	docker compose exec backend npx prisma migrate dev

seed:
	docker compose exec backend pnpm db:seed

migration-create:
	docker compose exec backend npx prisma migrate dev --create-only

db-push:
	docker compose exec backend npx prisma db push

studio:
	@BACKEND_ID=$$(docker ps -q --filter label=com.docker.compose.project=task-manager --filter label=com.docker.compose.service=backend); \
	if [ -z "$$BACKEND_ID" ]; then \
		echo "Backend: not running"; \
		echo "Run: make dev or make prod first."; \
		exit 1; \
	fi; \
	if docker exec $$BACKEND_ID sh -lc 'pgrep -f "^npm exec prisma studio --browser none --port 5555" >/dev/null'; then \
		echo "Prisma Studio is already running at http://localhost:5555"; \
		echo "Use: make studio-stop (then make studio to restart)."; \
	else \
		docker exec -d $$BACKEND_ID sh -lc 'npx prisma studio --browser none --port 5555 >/tmp/prisma-studio.log 2>&1'; \
		echo "Prisma Studio started at http://localhost:5555"; \
	fi

studio-stop:
	@BACKEND_ID=$$(docker ps -q --filter label=com.docker.compose.project=task-manager --filter label=com.docker.compose.service=backend); \
	if [ -z "$$BACKEND_ID" ]; then \
		echo "Backend: not running"; \
		exit 0; \
	fi; \
	PIDS=$$(docker exec $$BACKEND_ID sh -lc 'pgrep -f "^npm exec prisma studio --browser none --port 5555" || true'); \
	if [ -n "$$PIDS" ]; then \
		docker exec $$BACKEND_ID sh -lc "kill $$PIDS"; \
		echo "Prisma Studio stopped."; \
	else \
		echo "Prisma Studio is not running."; \
	fi

studio-status:
	@BACKEND_ID=$$(docker ps -q --filter label=com.docker.compose.project=task-manager --filter label=com.docker.compose.service=backend); \
	if [ -z "$$BACKEND_ID" ]; then \
		echo "Backend: not running"; \
		exit 0; \
	fi; \
	if docker exec $$BACKEND_ID sh -lc 'pgrep -f "^npm exec prisma studio --browser none --port 5555" >/dev/null'; then \
		echo "Prisma Studio: running at http://localhost:5555"; \
		docker exec $$BACKEND_ID sh -lc 'pgrep -af "^npm exec prisma studio --browser none --port 5555"'; \
	else \
		echo "Prisma Studio: not running"; \
	fi

frontend:
	cd frontend && pnpm dev

frontend-build:
	cd frontend && pnpm build

frontend-install:
	cd frontend && pnpm install

status:
	@BACKEND_ID=$$(docker ps -q --filter label=com.docker.compose.project=task-manager --filter label=com.docker.compose.service=backend); \
	POSTGRES_ID=$$(docker ps -q --filter label=com.docker.compose.project=task-manager --filter label=com.docker.compose.service=postgres); \
	if [ -z "$$BACKEND_ID" ]; then \
		echo "Backend: not running"; \
		echo "Run: make dev (local) or make prod (production mode)"; \
		exit 0; \
	fi; \
	CMD=$$(docker inspect -f '{{.Config.Cmd}}' $$BACKEND_ID); \
	case "$$CMD" in \
		*"nest start --watch"*) MODE="DEV" ;; \
		*"node dist/main"*) MODE="PROD" ;; \
		*) MODE="UNKNOWN" ;; \
	esac; \
	NODE_ENV=$$(docker exec $$BACKEND_ID sh -lc 'printf "%s" "$$NODE_ENV"' 2>/dev/null || true); \
	echo "Backend mode: $$MODE"; \
	echo "Backend URL: http://localhost:3000"; \
	if [ -n "$$POSTGRES_ID" ]; then \
		echo "Postgres: running (localhost:5432)"; \
	else \
		echo "Postgres: not running"; \
	fi; \
	if [ -n "$$NODE_ENV" ]; then \
		echo "Container NODE_ENV: $$NODE_ENV"; \
	fi
