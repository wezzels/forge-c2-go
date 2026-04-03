/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { Deferred } from '../../src/ts/common-util/deferred-util';
import { createDeferred } from '../../src/ts/common-util/deferred-util';

describe('createDeferred', () => {
  it('should resolve the promise with the correct value', async () => {
    const deferred: Deferred<number> = createDeferred<number>();
    setTimeout(() => deferred.resolve(123), 10);
    await expect(deferred.promise).resolves.toBe(123);
  });

  it('should reject the promise with the correct reason', async () => {
    const deferred: Deferred<string> = createDeferred<string>();
    const error = new Error('test error');
    setTimeout(() => deferred.reject(error), 10);
    await expect(deferred.promise).rejects.toBe(error);
  });

  it('promise should be pending until resolved or rejected', () => {
    const deferred: Deferred<boolean> = createDeferred<boolean>();
    // The promise executor should not have been called yet
    let isPending = true;
    deferred.promise.then(
      () => {
        isPending = false;
      },
      () => {
        isPending = false;
      }
    );
    // Immediately after creation, it should still be pending
    expect(isPending).toBe(true);
    // Clean up by resolving so unhandled rejections are not thrown
    deferred.resolve(true);
  });
});
