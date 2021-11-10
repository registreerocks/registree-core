# syntax=docker/dockerfile:1.2
# Docs: https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/syntax.md

# Multi-stage build file for registree-core.
#
# Useful targets (see descriptions below):
#
#  - base
#  - run (default)
#
# Example: Use base to run the test suite:
#
#    export DOCKER_BUILDKIT=1
#    docker build . --target base --tag testing
#    docker run -it --rm testing yarn test
#


# STAGE: base-node
# Base node with non-root user, and /app dir.
FROM node:17-alpine AS base-node

# XXX: Work around USER / WORKDIR interactions in older Docker
RUN mkdir /app && chown node:node /app

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node
WORKDIR /app


# STAGE: base-yarn
# Base with Yarn config and registree-core package definition.
FROM base-node AS base-yarn
# Yarn config:
RUN mkdir .yarn
COPY --chown=node .yarn/plugins/ .yarn/plugins/
COPY --chown=node .yarn/releases/ .yarn/releases/
COPY --chown=node .yarnrc.yml .
# Yarn patches:
COPY --chown=node add-nestjs-dataloader-types.diff .
# registree-core:
COPY --chown=node package.json .
COPY --chown=node yarn.lock .


# STAGE: build-deps
# OUTPUTS: .yarn .pnp.cjs
# Build the dependencies of registree-core.
# This uses a cache mount for Yarn's global cache.
FROM base-yarn AS build-deps
RUN mkdir -p /home/node/.yarn/berry/cache  # For correct permissions
RUN --mount=type=cache,uid=1000,gid=1000,target=/home/node/.yarn/berry/cache \
  yarn install --immutable

# STAGE: base-deps
# Base with dependencies ready for use.
FROM base-yarn AS base-deps
COPY --from=build-deps /app/.yarn/ .yarn/
COPY --from=build-deps /app/.pnp.cjs .

# STAGE: base
# Base with dependencies and registree-core's source code ready for use.
FROM base-deps AS base
COPY --chown=node src/ src/
COPY --chown=node test/ test/
COPY --chown=node tsconfig.json .
COPY --chown=node tsconfig.build.json .


# STAGE: build
# OUTPUT: dist
# Build registree-core itself.
FROM base AS build
RUN yarn build

# STAGE: run
# Run the built registree-core.
FROM base-node AS run
COPY --from=build-deps /app/.yarn/cache/ /app/.yarn/cache/
COPY --from=build-deps /app/.yarn/unplugged/ /app/.yarn/unplugged/
COPY --from=build-deps /app/.pnp.cjs /app/.pnp.cjs
COPY --from=build /app/dist/ /app/dist/

EXPOSE 3000

# https://yarnpkg.com/features/pnp#initializing-pnp
ENV NODE_OPTIONS="--require /app/.pnp.cjs"
CMD ["node", "/app/dist/main.js"]
