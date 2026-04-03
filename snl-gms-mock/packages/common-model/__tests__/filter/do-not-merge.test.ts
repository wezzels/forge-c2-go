import { z } from 'zod';

interface MountBindCommon {
  type: 'bind';
  source: string;
  target: string;
  from?: string;
}

interface MountBindReadWrite extends MountBindCommon {
  readwrite: boolean;
}

interface MountBindRW extends MountBindCommon {
  rw: boolean;
}

type MountBind = MountBindCommon | MountBindReadWrite | MountBindRW;

const zMountBindCommon = z.object({
  type: z.literal('bind'),
  source: z.string(),
  target: z.string(),
  from: z.string().optional()
});

const zMountBindReadWrite = zMountBindCommon.extend({
  readwrite: z.boolean()
});

const zMountBindRW = zMountBindCommon.extend({
  rw: z.boolean()
});

const zMountBind = z.union([
  zMountBindReadWrite.strict(),
  zMountBindRW.strict(),
  zMountBindCommon.strict()
]);

const zMountCache = z.object({ type: z.literal('cache') });

// ... define other schema types

const zMountOpts = z.union([
  zMountBindReadWrite.strict(),
  zMountBindRW.strict(),
  zMountBindCommon.strict(),
  zMountCache.strict()
]);

// Cases
const tests: Record<string, MountBind | object> = {};

tests.common = { type: 'bind', source: '/source', target: '/target' }; // Pass on zMountBindCommon

tests.rw1 = { ...tests.common, rw: false }; // Pass on zMountBindRW only
tests.rw2 = { ...tests.common, rw: true }; // Pass on zMountBindRW only

tests.readwrite1 = { ...tests.common, readwrite: false }; // Pass on zMountBindReadWrite only
tests.readwrite2 = { ...tests.common, readwrite: true }; // Pass on zMountBindReadWrite only

tests.collision1 = { ...tests.common, rw: false, readwrite: false }; // Fail always
tests.collision2 = { ...tests.common, rw: true, readwrite: true }; // Fail always
tests.collision3 = { ...tests.common, rw: false, readwrite: true }; // Fail always
tests.collision4 = { ...tests.common, rw: true, readwrite: false }; // Fail always

tests.cache = { type: 'cache' }; // Pass on zMountCache only

tests.invalid = { type: 'invalid' }; // Fail always

// Tests
describe('zod-strict-union', () => {
  describe('zMountBindCommon', () => {
    test('common', () => {
      expect(zMountBindCommon.strict().safeParse(tests.common).success).toBeTruthy();
    });
    test('rw1', () => {
      expect(zMountBindCommon.strict().safeParse(tests.rw1).success).toBeFalsy();
    });
    test('rw2', () => {
      expect(zMountBindCommon.strict().safeParse(tests.rw2).success).toBeFalsy();
    });
    test('readwrite1', () => {
      expect(zMountBindCommon.strict().safeParse(tests.readwrite1).success).toBeFalsy();
    });
    test('readwrite2', () => {
      expect(zMountBindCommon.strict().safeParse(tests.readwrite2).success).toBeFalsy();
    });
    test('collision1', () => {
      expect(zMountBindCommon.strict().safeParse(tests.collision1).success).toBeFalsy();
    });
    test('collision2', () => {
      expect(zMountBindCommon.strict().safeParse(tests.collision2).success).toBeFalsy();
    });
    test('collision3', () => {
      expect(zMountBindCommon.strict().safeParse(tests.collision3).success).toBeFalsy();
    });
    test('collision4', () => {
      expect(zMountBindCommon.strict().safeParse(tests.collision4).success).toBeFalsy();
    });
    test('cache', () => {
      expect(zMountBindCommon.strict().safeParse(tests.cache).success).toBeFalsy();
    });
    test('invalid', () => {
      expect(zMountBindCommon.strict().safeParse(tests.invalid).success).toBeFalsy();
    });
  });

  describe('zMountBindReadWrite', () => {
    test('common', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.common).success).toBeFalsy();
    });
    test('rw1', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.rw1).success).toBeFalsy();
    });
    test('rw2', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.rw2).success).toBeFalsy();
    });
    test('readwrite1', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.readwrite1).success).toBeTruthy();
    });
    test('readwrite2', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.readwrite2).success).toBeTruthy();
    });
    test('collision1', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.collision1).success).toBeFalsy();
    });
    test('collision2', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.collision2).success).toBeFalsy();
    });
    test('collision3', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.collision3).success).toBeFalsy();
    });
    test('collision4', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.collision4).success).toBeFalsy();
    });
    test('cache', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.cache).success).toBeFalsy();
    });
    test('invalid', () => {
      expect(zMountBindReadWrite.strict().safeParse(tests.invalid).success).toBeFalsy();
    });
  });

  describe('zMountBindRW', () => {
    test('common', () => {
      expect(zMountBindRW.strict().safeParse(tests.common).success).toBeFalsy();
    });
    test('rw1', () => {
      expect(zMountBindRW.strict().safeParse(tests.rw1).success).toBeTruthy();
    });
    test('rw2', () => {
      expect(zMountBindRW.strict().safeParse(tests.rw2).success).toBeTruthy();
    });
    test('readwrite1', () => {
      expect(zMountBindRW.strict().safeParse(tests.readwrite1).success).toBeFalsy();
    });
    test('readwrite2', () => {
      expect(zMountBindRW.strict().safeParse(tests.readwrite2).success).toBeFalsy();
    });
    test('collision1', () => {
      expect(zMountBindRW.strict().safeParse(tests.collision1).success).toBeFalsy();
    });
    test('collision2', () => {
      expect(zMountBindRW.strict().safeParse(tests.collision2).success).toBeFalsy();
    });
    test('collision3', () => {
      expect(zMountBindRW.strict().safeParse(tests.collision3).success).toBeFalsy();
    });
    test('collision4', () => {
      expect(zMountBindRW.strict().safeParse(tests.collision4).success).toBeFalsy();
    });
    test('cache', () => {
      expect(zMountBindRW.strict().safeParse(tests.cache).success).toBeFalsy();
    });
    test('invalid', () => {
      expect(zMountBindRW.strict().safeParse(tests.invalid).success).toBeFalsy();
    });
  });

  describe('zMountBind', () => {
    test('common', () => {
      expect(zMountBind.safeParse(tests.common).success).toBeTruthy();
    });
    test('rw1', () => {
      expect(zMountBind.safeParse(tests.rw1).success).toBeTruthy();
    });
    test('rw2', () => {
      expect(zMountBind.safeParse(tests.rw2).success).toBeTruthy();
    });
    test('readwrite1', () => {
      expect(zMountBind.safeParse(tests.readwrite1).success).toBeTruthy();
    });
    test('readwrite2', () => {
      expect(zMountBind.safeParse(tests.readwrite2).success).toBeTruthy();
    });
    test('collision1', () => {
      expect(zMountBind.safeParse(tests.collision1).success).toBeFalsy();
    });
    test('collision2', () => {
      expect(zMountBind.safeParse(tests.collision2).success).toBeFalsy();
    });
    test('collision3', () => {
      expect(zMountBind.safeParse(tests.collision3).success).toBeFalsy();
    });
    test('collision4', () => {
      expect(zMountBind.safeParse(tests.collision4).success).toBeFalsy();
    });
    test('cache', () => {
      expect(zMountBind.safeParse(tests.cache).success).toBeFalsy();
    });
    test('invalid', () => {
      expect(zMountBind.safeParse(tests.invalid).success).toBeFalsy();
    });
  });

  describe('zMountCache', () => {
    test('common', () => {
      expect(zMountCache.strict().safeParse(tests.common).success).toBeFalsy();
    });
    test('rw1', () => {
      expect(zMountCache.strict().safeParse(tests.rw1).success).toBeFalsy();
    });
    test('rw2', () => {
      expect(zMountCache.strict().safeParse(tests.rw2).success).toBeFalsy();
    });
    test('readwrite1', () => {
      expect(zMountCache.strict().safeParse(tests.readwrite1).success).toBeFalsy();
    });
    test('readwrite2', () => {
      expect(zMountCache.strict().safeParse(tests.readwrite2).success).toBeFalsy();
    });
    test('collision1', () => {
      expect(zMountCache.strict().safeParse(tests.collision1).success).toBeFalsy();
    });
    test('collision2', () => {
      expect(zMountCache.strict().safeParse(tests.collision2).success).toBeFalsy();
    });
    test('collision3', () => {
      expect(zMountCache.strict().safeParse(tests.collision3).success).toBeFalsy();
    });
    test('collision4', () => {
      expect(zMountCache.strict().safeParse(tests.collision4).success).toBeFalsy();
    });
    test('cache', () => {
      expect(zMountCache.strict().safeParse(tests.cache).success).toBeTruthy();
    });
    test('invalid', () => {
      expect(zMountCache.strict().safeParse(tests.invalid).success).toBeFalsy();
    });
  });

  describe('zMountOpts', () => {
    test('common', () => {
      expect(zMountOpts.safeParse(tests.common).success).toBeTruthy();
    });
    test('rw1', () => {
      expect(zMountOpts.safeParse(tests.rw1).success).toBeTruthy();
    });
    test('rw2', () => {
      expect(zMountOpts.safeParse(tests.rw2).success).toBeTruthy();
    });
    test('readwrite1', () => {
      expect(zMountOpts.safeParse(tests.readwrite1).success).toBeTruthy();
    });
    test('readwrite2', () => {
      expect(zMountOpts.safeParse(tests.readwrite2).success).toBeTruthy();
    });
    test('collision1', () => {
      expect(zMountOpts.safeParse(tests.collision1).success).toBeFalsy();
    });
    test('collision2', () => {
      expect(zMountOpts.safeParse(tests.collision2).success).toBeFalsy();
    });
    test('collision3', () => {
      expect(zMountOpts.safeParse(tests.collision3).success).toBeFalsy();
    });
    test('collision4', () => {
      expect(zMountOpts.safeParse(tests.collision4).success).toBeFalsy();
    });
    test('cache', () => {
      expect(zMountOpts.safeParse(tests.cache).success).toBeTruthy();
    });
    test('invalid', () => {
      expect(zMountOpts.safeParse(tests.invalid).success).toBeFalsy();
    });
  });
});
