# Benchmark

> Forked from https://github.com/krausest/js-framework-benchmark

The benchmark for PWC and other frameworks.

## Build framework bench case

Like `keyed/lit`:

```bash
$ cd benchmarks/frameworks/keyed/lit
$ npm install
$ npm run build-prod
```

## Start web server

```bash
$ npm run start-bench-server
```

After start web server, you can visit framework dist file, like http://localhost:8080/frameworks/lit/index.html


## Compile benchmark framework code and run bench

```bash
$ cd benchmarks/webdriver-ts
$ npm run compile
$ npm run bench
```

## Generate result

```bash
$ cd benchmarks/webdriver-ts
$ npm run results
```

## View results

Now you can view the benmark result in: http://localhost:8080/webdriver-ts-results/table.html

And you can see last benchmark result in: http://localhost:8080/webdriver-ts-results/table_last.html
