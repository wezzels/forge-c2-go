/**
 * Creates a conditional test closure.
 *
 * @param condition if true return {@link it} else {@link it.skip}
 * @returns a test closure.
 */
export const itIf = condition => (condition ? it : it.skip);

/**
 * Creates a conditional test closure.
 *
 * @param condition if true return {@link it} else {@link it.skip}
 * @returns a test closure.
 */
export const testIf = condition => (condition ? test : test.skip);

/**
 * Creates a performance test test closure.
 * !SKIPPED if {@link process.env.DISABLE_PERFORMANCE_TEST} is set to `true`
 *
 * @returns a performance test closure.
 */
export const testPerformance = testIf(process.env.DISABLE_PERFORMANCE_TEST !== 'true');

/**
 * Creates a precache test test closure.
 * !SKIPPED if {@link process.env.GMS_DISABLE_PRE_CACHE} is set to `true`
 *
 * @returns a precache test closure.
 */
export const testPrecache = testIf(process.env.GMS_DISABLE_PRE_CACHE !== 'true');
