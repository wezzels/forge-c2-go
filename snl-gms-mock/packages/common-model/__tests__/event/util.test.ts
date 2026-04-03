import { DepthRestraintReason, RestrainerType, RestraintType } from '../../src/ts/event/types';
import { determineRestraint } from '../../src/ts/event/util';

describe('event util', () => {
  it('exists', () => {
    expect(determineRestraint).toBeDefined();
  });

  it('can determine restraint', () => {
    expect(
      determineRestraint({
        depthRestraintType: RestraintType.UNRESTRAINED,
        epicenterRestraintType: RestraintType.UNRESTRAINED,
        timeRestraintType: RestraintType.UNRESTRAINED
      })
    ).toMatchInlineSnapshot(`"UNRESTRAINED"`);

    expect(
      determineRestraint({
        depthRestraintType: RestraintType.FIXED,
        depthRestraintReason: DepthRestraintReason.FIXED_AT_SURFACE,
        epicenterRestraintType: RestraintType.UNRESTRAINED,
        timeRestraintType: RestraintType.UNRESTRAINED,
        restrainer: RestrainerType.FIXED_BY_CONFIGURATION
      })
    ).toMatchInlineSnapshot(`"FIXED_AT_SURFACE"`);

    expect(
      determineRestraint({
        depthRestraintType: RestraintType.FIXED,
        depthRestraintReason: DepthRestraintReason.FIXED_AT_STANDARD_DEPTH,
        epicenterRestraintType: RestraintType.UNRESTRAINED,
        timeRestraintType: RestraintType.UNRESTRAINED,
        restrainer: RestrainerType.FIXED_BY_CONFIGURATION
      })
    ).toMatchInlineSnapshot(`"FIXED_AT_DEPTH"`);

    expect(
      determineRestraint({
        depthRestraintType: RestraintType.FIXED,
        depthRestraintReason: DepthRestraintReason.OTHER,
        epicenterRestraintType: RestraintType.FIXED,
        timeRestraintType: RestraintType.FIXED,
        restrainer: RestrainerType.FIXED_BY_LOCATOR
      })
    ).toMatchInlineSnapshot(`"FIXED_BY_LOCATOR"`);

    expect(
      determineRestraint({
        depthRestraintType: RestraintType.FIXED,
        depthRestraintReason: DepthRestraintReason.FIXED_AT_STANDARD_DEPTH,
        epicenterRestraintType: RestraintType.UNRESTRAINED,
        timeRestraintType: RestraintType.UNRESTRAINED,
        restrainer: RestrainerType.FIXED_BY_ANALYST
      })
    ).toMatchInlineSnapshot(`"FIXED_BY_ANALYST"`);

    expect(determineRestraint({} as any)).toMatchInlineSnapshot(`"UNKNOWN"`);
  });
});
