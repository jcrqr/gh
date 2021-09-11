# :octocat: gh

> Module to use GitHub CLI (aka `gh`) in Deno. Useful to create [extensions](https://cli.github.com/manual/gh_extension) using Deno.

## Installation

```ts
import { gh } from "https://deno.land/x/gh@v0.0.1/mod.ts";
```

## Usage

```ts
import { gh } from "https://deno.land/x/gh@v0.0.1/mod.ts";

async function gh(cmd: string, options: Options): Promise<unknown>
```

## Options

```ts
interface Options {
  debug?: boolean;
  flags?: Record<string, string | number | boolean | Array<string | number | boolean>>;
  json?: boolean;
}
```

## Example

```ts
import { gh } from "./mod.ts";

const repos = await gh("api users/octocat/repos", {
  json: true,
  flags: { paginate: true },
}) as Array<unknown>;

console.log(`@octocat has ${repos.length} repos`);
```

## Permissions

This module requires the `--allow-run` permission.

## Contributing

Please, see [CONTRIBUTING.md](CONTRIBUTING.md) to learn how you can contribute to this repository.

## License

This project is released under the [MIT License](LICENSE).