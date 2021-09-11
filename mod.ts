import { green, red } from "./deps.ts";

export interface Options {
  debug?: boolean;
  flags?: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  >;
  json?: boolean;
}

export async function gh(cmd: string, options: Options = {}): Promise<unknown> {
  const exec = await execPath();

  if (options.debug) {
    console.log(`${green("exec:")} ${exec}`);
  }

  const flags = Object.entries((options.flags || {})).map(([key, val]) => {
    let flag = key;

    if (!flag.startsWith("-") || !flag.startsWith("--")) {
      flag = flag.length === 1 ? `-${flag}` : `--${flag}`;
    }

    if (typeof val === "boolean") {
      return flag;
    }

    if (Array.isArray(val)) {
      return `${flag} ${val.join(" ")}`;
    }

    return `${flag} ${val.toString()}`;
  });

  if (options.debug) {
    console.log(
      `${green("exec:")} gh ${[exec, ...cmd.split(" "), ...flags].join(" ")}`,
    );
  }

  const p = Deno.run({
    cmd: [exec, ...cmd.split(" "), ...flags],
    stdout: "piped",
    stderr: "piped",
    env: {
      PAGER: "",
    },
  });

  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);

  if (options.debug) {
    console.log(`${green("status:")} ${status.code}`);
  }

  if (status.code !== 0) {
    const error = new TextDecoder().decode(stderr);

    if (options.debug) {
      console.error(`${red("error:")} ${error}`);
    }

    throw new Error(error);
  }

  if (!options.json) {
    return stdout;
  }

  if (options.debug) {
    console.log(`${green("exec:")} attempting to parse JSON`);
  }

  return JSON.parse(new TextDecoder().decode(stdout));
}

async function execPath(): Promise<string> {
  const p = Deno.run({
    cmd: ["which", "gh"],
    stdout: "piped",
    stderr: "piped",
  });

  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);

  if (status.code !== 0) {
    const error = new TextDecoder().decode(stderr);

    throw new Error(`Failed to find gh executable: ${error}`);
  }

  return new TextDecoder().decode(stdout).trimEnd();
}
