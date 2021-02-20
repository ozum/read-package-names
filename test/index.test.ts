import { join } from "path";
import readPackageNames from "../src";

describe("readPackageNames", () => {
  it("should read package names.", async () => {
    const packages = await readPackageNames(join(__dirname, "test_helper/node_modules"));
    expect(packages.sort()).toEqual(["@s/x", "@s/y", "a", "b"]);
  });

  it("should read scoped package names.", async () => {
    const packages = await readPackageNames(join(__dirname, "test_helper/node_modules"), { scope: "@s" });
    expect(packages.sort()).toEqual(["@s/x", "@s/y"]);
  });

  it("should read scoped package names without '@' sign.", async () => {
    const packages = await readPackageNames(join(__dirname, "test_helper/node_modules"), { scope: "s" });
    expect(packages.sort()).toEqual(["@s/x", "@s/y"]);
  });
});
