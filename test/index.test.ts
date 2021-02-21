import { join } from "path";
import readPackageNames from "../src";

const DIR = join(__dirname, "test_helper/module_dir");

describe("readPackageNames", () => {
  it("should read package names.", async () => {
    const packages = await readPackageNames(DIR);
    expect(packages.sort()).toEqual(["@r/x-m", "@s/x-k", "@s/y-l", "a-e", "b-f"]);
  });

  it("should read scoped package names.", async () => {
    const packages = await readPackageNames(DIR, { scope: "@s" });
    expect(packages.sort()).toEqual(["@s/x-k", "@s/y-l"]);
  });

  it("should read scoped package names without '@' sign.", async () => {
    const packages = await readPackageNames(DIR, { scope: ["s"] });
    expect(packages.sort()).toEqual(["@s/x-k", "@s/y-l"]);
  });

  it("should read scoped packages from multiple scopes.", async () => {
    const packages = await readPackageNames(DIR, { scope: ["r", "s"] });
    expect(packages.sort()).toEqual(["@r/x-m", "@s/x-k", "@s/y-l"]);
  });

  it("should ignore error if scope does not exist.", async () => {
    const packages = await readPackageNames(DIR, { scope: ["NON-EXISTING"] });
    expect(packages.sort()).toEqual([]);
  });

  it("should throw error if scope does not exist and silent is false.", async () => {
    await expect(() => readPackageNames(DIR, { scope: ["NON-EXISTING"], silent: false })).rejects.toThrow("ENOENT:");
  });

  it("should read prefixed packages.", async () => {
    const packages = await readPackageNames(DIR, { prefix: ["x", "a"] });
    expect(packages.sort()).toEqual(["@r/x-m", "@s/x-k", "a-e"]);
  });

  it("should read prefixed packages from given scope.", async () => {
    const packages = await readPackageNames(DIR, { prefix: ["x"], scope: "r" });
    expect(packages.sort()).toEqual(["@r/x-m"]);
  });
});
