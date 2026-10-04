import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

const getSessionUser = vi.fn();
vi.mock("@/server/auth/session", () => ({ getSessionUser: () => getSessionUser() }));

import type { NextRequest } from "next/server";
import { ServiceError } from "@/server/services/errors";
import { HttpError, readJson, route } from "./handler";

const req = (body?: unknown, method = "POST") =>
  ({
    method,
    nextUrl: new URL("http://test/api/v1/x"),
    json: async () => {
      if (body === undefined) throw new Error("no body");
      return body;
    },
  }) as unknown as NextRequest;
const ctx = { params: Promise.resolve({}) };
const user = { id: "u1", name: "Ada", email: "a@b.co", image: null, phone: null, role: "customer" as const };

beforeEach(() => getSessionUser.mockReset());

describe("route()", () => {
  it("wraps data in the ActionResult envelope", async () => {
    const res = await route({}, async () => ({ hello: "world" }))(req(), ctx);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, data: { hello: "world" } });
  });

  it("returns 401 when a user is required and nobody is signed in", async () => {
    getSessionUser.mockResolvedValue(null);
    const res = await route({ access: "user" }, async () => "secret")(req(), ctx);
    expect(res.status).toBe(401);
    expect(await res.json()).toMatchObject({ ok: false, error: "Sign in to continue." });
  });

  it("passes the user to the handler and never caches private data", async () => {
    getSessionUser.mockResolvedValue(user);
    const res = await route({ access: "user" }, async ({ user: u }) => u.id)(req(), ctx);
    expect(await res.json()).toEqual({ ok: true, data: "u1" });
    expect(res.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("does not look up the session for public routes", async () => {
    await route({}, async () => 1)(req(), ctx);
    expect(getSessionUser).not.toHaveBeenCalled();
  });

  it("lets the CDN cache successful public responses only", async () => {
    const ok = await route({ cache: "public" }, async () => 1)(req(), ctx);
    expect(ok.headers.get("Cache-Control")).toContain("s-maxage");
    const err = await route({ cache: "public" }, async () => {
      throw new HttpError(404, "nope");
    })(req(), ctx);
    expect(err.headers.get("Cache-Control")).toBe("private, no-store");
  });

  it("maps HttpError to its status and keeps field errors", async () => {
    const res = await route({}, async () => {
      throw new HttpError(400, "bad", { email: ["Required"] });
    })(req(), ctx);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "bad", fieldErrors: { email: ["Required"] } });
  });

  it("maps ServiceError to 409 with its message", async () => {
    const res = await route({}, async () => {
      throw new ServiceError("Only 2 left.");
    })(req(), ctx);
    expect(res.status).toBe(409);
    expect(await res.json()).toMatchObject({ ok: false, error: "Only 2 left." });
  });

  it("hides unexpected errors behind a generic 500", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await route({}, async () => {
      throw new Error("db password leaked");
    })(req(), ctx);
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("leaked");
  });
});

describe("readJson()", () => {
  const schema = z.object({ email: z.email("Enter a valid email address") });

  it("returns parsed data", async () => {
    await expect(readJson(req({ email: "a@b.co" }), schema)).resolves.toEqual({ email: "a@b.co" });
  });

  it("throws 400 with field errors on invalid input", async () => {
    await expect(readJson(req({ email: "nope" }), schema)).rejects.toMatchObject({
      status: 400,
      fieldErrors: { email: ["Enter a valid email address"] },
    });
  });

  it("throws 400 when the body is not JSON", async () => {
    await expect(readJson(req(undefined), schema)).rejects.toMatchObject({ status: 400 });
  });
});
