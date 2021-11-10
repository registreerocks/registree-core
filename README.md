# Registree Core

## Description

Core graphql server for registree.

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Docker image validation with goss

The repository contains a [goss] spec to validate the built Docker image.

[goss]: https://goss.rocks/

To run the validation:

```shell
dgoss run --env-file .env registree-core_registree-core
```

Transcript of interactively drafting the goss tests:

```shell
$ docker-compose build
$ dgoss edit --env-file .env registree-core_registree-core
/goss $ goss add process node
/goss $ goss add port 3000
```
