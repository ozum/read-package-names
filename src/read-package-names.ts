import junk from "junk";
import { promises as fs } from "fs";
import { basename, join } from "path";
import * as ignore from "ignor";

/**
 * Converts it's input to an array.
 * - Arrays are returned as is.
 * - `undefined` are returned as an empty array.
 * - Non-aray values are returned as a single element array.
 *
 * @param input is the input to convert to array.
 * @returns input converted to an array.
 */
function arrify<T extends any>(input?: T | T[]): T[] {
  if (input === undefined) return [];
  return Array.isArray(input) ? input : [input];
}

/**
 * Splits package names and scopes.
 *
 * @param entries are the list of entries.
 * @returns list of packages and list of scopes.
 *
 * @example
 * await splitEntries(["pg-structure", "lodash", @babel"]); // [["pg-structure", "lodash"], ["@babel"]]
 */
function splitEntries(entries: string[]): [string[], string[]] {
  const packages: string[] = [];
  const scopes: string[] = [];
  entries.filter(junk.not).forEach((entry) => (entry.startsWith("@") ? scopes.push(entry) : packages.push(entry)));

  return [packages, scopes];
}

/**
 * Reads all package names for a scope in a given directory.
 *
 * @param cwd is the directory to read package names from.
 * @param scopes are the list of scopes to get package names for.
 * @param silent prevents errors caused by not-found prefixes.
 * @returns the list of package names fro the given scope.
 *
 * @example
 * await readScopedPackageNames("node_modules", "@babel"); // ["@babel/runtime", "@babel/template", ...]
 * await readScopedPackageNames("node_modules", "@not-found"); // []
 * await readScopedPackageNames("node_modules", "@not-found", { silent: false }); // Throws `ENOENT`
 */
async function readScopedPackageNames(cwd: string, scopes: string[], { silent = true } = {}): Promise<string[]> {
  const errorCodes = silent ? ["ENOENT", "ENOTDIR"] : [];
  return (
    await Promise.all(
      scopes.map(async (scope) =>
        (await fs.readdir(join(cwd, scope)).catch(ignore.code(errorCodes, [] as string[]))).map((name) => join(scope, name))
      )
    )
  )
    .flat()
    .filter(junk.not);
}

/**
 * Reads all package names including scoped packages from a directory.
 *
 * @param cwd is the directory to read package names from.
 * @returns the list of package names including scoped packages.
 *
 * @example
 * await readPackageNames("node_modules"); // ["pg-structure", "@babel/runtime", ...]
 */
async function readAllPackageNames(cwd: string): Promise<string[]> {
  const [packages, scopes] = splitEntries(await fs.readdir(cwd));
  const scopedPackages = await readScopedPackageNames(cwd, scopes);
  return scopedPackages.concat(packages);
}

/**
 * Reads all package names from a directory.
 *
 * @param cwd is the directory to read package names from.
 * @param options are options.
 * @param scope reads only packages from a scope or one of the scopes.
 * @param prefix reads only packages beginning with a prefix or one of the prefixes. Prefix is joined with a dash (e.g. "pg" -> "pg-structure").
 * @param silent prevents errors caused by not-found directories.
 * @returns the list of package names including scoped packages.
 *
 * @example
 * await readPackageNames("node_modules"); // ["pg-structure", "@babel/runtime", ...]
 * await readPackageNames("node_modules", { scope: "babel" }); // ["@babel/runtime", "@babel/template", ...]
 * await readScopedPackageNames("node_modules", { scope: "not-found" }); // []
 * await readScopedPackageNames("node_modules", { scope: "not-found", silent: false }); // Throws `ENOENT`
 * await readPackageNames("node_modules", { prefix: "pg" }); // ["pg-structure", "pg-generator", "@user/pg-promise", ...]
 */
export async function readPackageNames(
  cwd: string,
  {
    scope,
    prefix,
    silent = true,
  }: {
    scope?: string | string[];
    prefix?: string | string[];
    silent?: boolean;
  } = {}
): Promise<string[]> {
  const scopes = arrify(scope).map((name) => (name.startsWith("@") ? name : `@${name}`));
  const prefixes = arrify(prefix);
  const packages = await (scope === undefined ? readAllPackageNames(cwd) : readScopedPackageNames(cwd, scopes, { silent }));
  return prefix ? packages.filter((packageName) => prefixes.some((pre) => basename(packageName).startsWith(pre))) : packages;
}
