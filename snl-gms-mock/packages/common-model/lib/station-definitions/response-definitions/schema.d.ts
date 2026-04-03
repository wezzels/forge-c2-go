import { z } from 'zod';
/**
 * Zod schema for validating {@link AmplitudePhaseResponse} objects.
 *
 * This schema ensures that the AmplitudePhaseResponse objects conform to the expected structure and types.
 */
export declare const amplitudePhaseResponseSchema: z.ZodObject<{
    amplitude: z.ZodObject<{
        value: z.ZodNumber;
        standardDeviation: z.ZodOptional<z.ZodNumber>;
        units: z.ZodNativeEnum<typeof import("../../common").Units>;
    }, "strict", z.ZodTypeAny, {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    }, {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    }>;
    phase: z.ZodObject<{
        value: z.ZodNumber;
        standardDeviation: z.ZodOptional<z.ZodNumber>;
        units: z.ZodNativeEnum<typeof import("../../common").Units>;
    }, "strict", z.ZodTypeAny, {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    }, {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    }>;
}, "strict", z.ZodTypeAny, {
    amplitude: {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    };
    phase: {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    };
}, {
    amplitude: {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    };
    phase: {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    };
}>;
/**
 * Represents the {@link Calibration} settings for a sensor or instrument.
 *
 * This schema is used to validate the calibration settings, ensuring that they conform to the expected structure and types.
 * ```
 */
export declare const calibrationSchema: z.ZodObject<{
    calibrationPeriodSec: z.ZodNumber;
    calibrationTimeShift: z.ZodNumber;
    calibrationFactor: z.ZodObject<{
        value: z.ZodNumber;
        standardDeviation: z.ZodOptional<z.ZodNumber>;
        units: z.ZodNativeEnum<typeof import("../../common").Units>;
    }, "strict", z.ZodTypeAny, {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    }, {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    }>;
}, "strict", z.ZodTypeAny, {
    calibrationPeriodSec: number;
    calibrationTimeShift: number;
    calibrationFactor: {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    };
}, {
    calibrationPeriodSec: number;
    calibrationTimeShift: number;
    calibrationFactor: {
        units: import("../../common").Units;
        value: number;
        standardDeviation?: number | undefined;
    };
}>;
/**
 * Zod schema for validating {@link FrequencyAmplitudePhase} objects.
 *
 * This schema ensures that the FrequencyAmplitudePhase objects conform to the expected structure and types.
 */
export declare const frequencyAmplitudePhaseSchema: z.ZodObject<{
    amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
        amplitude: z.ZodObject<{
            value: z.ZodNumber;
            standardDeviation: z.ZodOptional<z.ZodNumber>;
            units: z.ZodNativeEnum<typeof import("../../common").Units>;
        }, "strict", z.ZodTypeAny, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }>;
        phase: z.ZodObject<{
            value: z.ZodNumber;
            standardDeviation: z.ZodOptional<z.ZodNumber>;
            units: z.ZodNativeEnum<typeof import("../../common").Units>;
        }, "strict", z.ZodTypeAny, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        amplitude: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
        phase: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }, {
        amplitude: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
        phase: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }>, "many">;
    frequencies: z.ZodArray<z.ZodNumber, "many">;
    id: z.ZodString;
    nominalCalibration: z.ZodOptional<z.ZodObject<{
        calibrationPeriodSec: z.ZodNumber;
        calibrationTimeShift: z.ZodNumber;
        calibrationFactor: z.ZodObject<{
            value: z.ZodNumber;
            standardDeviation: z.ZodOptional<z.ZodNumber>;
            units: z.ZodNativeEnum<typeof import("../../common").Units>;
        }, "strict", z.ZodTypeAny, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }, {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }>>;
    nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    id: string;
    amplitudePhaseResponses: {
        amplitude: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
        phase: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }[];
    frequencies: number[];
    nominalCalibration?: {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    } | undefined;
    nominalSampleRateHz?: number | undefined;
}, {
    id: string;
    amplitudePhaseResponses: {
        amplitude: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
        phase: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }[];
    frequencies: number[];
    nominalCalibration?: {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    } | undefined;
    nominalSampleRateHz?: number | undefined;
}>;
/**
 * Represents the response of a channel, including calibration, effective time range, and frequency-amplitude-phase response.
 *
 * This schema is used to validate the response settings, ensuring that they conform to the expected structure and types.
 */
export declare const responseSchema: z.ZodObject<{
    calibration: z.ZodOptional<z.ZodObject<{
        calibrationPeriodSec: z.ZodNumber;
        calibrationTimeShift: z.ZodNumber;
        calibrationFactor: z.ZodObject<{
            value: z.ZodNumber;
            standardDeviation: z.ZodOptional<z.ZodNumber>;
            units: z.ZodNativeEnum<typeof import("../../common").Units>;
        }, "strict", z.ZodTypeAny, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }, {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        }>;
    }, "strict", z.ZodTypeAny, {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }, {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    }>>;
    effectiveAt: z.ZodNumber;
    effectiveUntil: z.ZodOptional<z.ZodNumber>;
    fapResponse: z.ZodOptional<z.ZodObject<{
        amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
            amplitude: z.ZodObject<{
                value: z.ZodNumber;
                standardDeviation: z.ZodOptional<z.ZodNumber>;
                units: z.ZodNativeEnum<typeof import("../../common").Units>;
            }, "strict", z.ZodTypeAny, {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            }, {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            }>;
            phase: z.ZodObject<{
                value: z.ZodNumber;
                standardDeviation: z.ZodOptional<z.ZodNumber>;
                units: z.ZodNativeEnum<typeof import("../../common").Units>;
            }, "strict", z.ZodTypeAny, {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            }, {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            }>;
        }, "strict", z.ZodTypeAny, {
            amplitude: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
            phase: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }, {
            amplitude: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
            phase: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }>, "many">;
        frequencies: z.ZodArray<z.ZodNumber, "many">;
        id: z.ZodString;
        nominalCalibration: z.ZodOptional<z.ZodObject<{
            calibrationPeriodSec: z.ZodNumber;
            calibrationTimeShift: z.ZodNumber;
            calibrationFactor: z.ZodObject<{
                value: z.ZodNumber;
                standardDeviation: z.ZodOptional<z.ZodNumber>;
                units: z.ZodNativeEnum<typeof import("../../common").Units>;
            }, "strict", z.ZodTypeAny, {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            }, {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            }>;
        }, "strict", z.ZodTypeAny, {
            calibrationPeriodSec: number;
            calibrationTimeShift: number;
            calibrationFactor: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }, {
            calibrationPeriodSec: number;
            calibrationTimeShift: number;
            calibrationFactor: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }>>;
        nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        id: string;
        amplitudePhaseResponses: {
            amplitude: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
            phase: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }[];
        frequencies: number[];
        nominalCalibration?: {
            calibrationPeriodSec: number;
            calibrationTimeShift: number;
            calibrationFactor: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        } | undefined;
        nominalSampleRateHz?: number | undefined;
    }, {
        id: string;
        amplitudePhaseResponses: {
            amplitude: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
            phase: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }[];
        frequencies: number[];
        nominalCalibration?: {
            calibrationPeriodSec: number;
            calibrationTimeShift: number;
            calibrationFactor: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        } | undefined;
        nominalSampleRateHz?: number | undefined;
    }>>;
    id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    id: string;
    effectiveAt: number;
    calibration?: {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    } | undefined;
    effectiveUntil?: number | undefined;
    fapResponse?: {
        id: string;
        amplitudePhaseResponses: {
            amplitude: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
            phase: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }[];
        frequencies: number[];
        nominalCalibration?: {
            calibrationPeriodSec: number;
            calibrationTimeShift: number;
            calibrationFactor: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        } | undefined;
        nominalSampleRateHz?: number | undefined;
    } | undefined;
}, {
    id: string;
    effectiveAt: number;
    calibration?: {
        calibrationPeriodSec: number;
        calibrationTimeShift: number;
        calibrationFactor: {
            units: import("../../common").Units;
            value: number;
            standardDeviation?: number | undefined;
        };
    } | undefined;
    effectiveUntil?: number | undefined;
    fapResponse?: {
        id: string;
        amplitudePhaseResponses: {
            amplitude: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
            phase: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        }[];
        frequencies: number[];
        nominalCalibration?: {
            calibrationPeriodSec: number;
            calibrationTimeShift: number;
            calibrationFactor: {
                units: import("../../common").Units;
                value: number;
                standardDeviation?: number | undefined;
            };
        } | undefined;
        nominalSampleRateHz?: number | undefined;
    } | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map