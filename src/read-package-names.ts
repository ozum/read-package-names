import junk from "junk";
import { promises as fs } from "fs";
import { join } from "path";

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
 * @param scope is the scope to get package names for.
 * @returns the list of package names fro the given scope.
 *
 * @example
 * await readScopedPackageNames("node_modules", "@babel"); // ["@babel/runtime", "@babel/template", ...]
 */
async function readScopedPackageNames(cwd: string, scope: string): Promise<string[]> {
  return (await fs.readdir(join(cwd, scope))).map((name) => join(scope, name)).filter(junk.not);
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
  const scopedPackages = (await Promise.all(scopes.map((scope) => readScopedPackageNames(cwd, scope)))).flat();
  return scopedPackages.concat(packages);
}

/**
 * Reads all package names from a directory.
 *
 * @param cwd is the directory to read package names from.
 * @param scope is the name of the scope to filter packages.
 * @returns the list of package names including scoped packages.
 *
 * @example
 * await readPackageNames("node_modules"); // ["pg-structure", "@babel/runtime", ...]
 * await readPackageNames("node_modules", { scope: "babel" }); // ["@babel/runtime", "@babel/template", ...]
 */
export async function readPackageNames(cwd: string, { scope }: { scope?: string } = {}): Promise<string[]> {
  return scope === undefined ? readAllPackageNames(cwd) : readScopedPackageNames(cwd, scope.startsWith("@") ? scope : `@${scope}`);
}
