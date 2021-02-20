import { join } from "path";
import readPackageNames from "../src";

const DIR = join(__dirname, "test_helper/module_dir");

describe("readPackageNames", () => {
  it("should read package names.", async () => {
    const packages = await readPackageNames(DIR);
    expect(packages.sort()).toEqual(["@s/x", "@s/y", "a", "b"]);
  });

  it("should read scoped package names.", async () => {
    const packages = await readPackageNames(DIR, { scope: "@s" });
    expect(packages.sort()).toEqual(["@s/x", "@s/y"]);
  });

  it("should read scoped package names without '@' sign.", async () => {
    const packages = await readPackageNames(DIR, { scope: "s" });
    expect(packages.sort()).toEqual(["@s/x", "@s/y"]);
  });
});
