import { describe, expect, it } from "vitest";
import { cn } from "../../src/lib/utils";

describe("utils", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar", "foo")).toContain("foo");
    expect(cn("foo", "bar")).toContain("bar");
  });
});
