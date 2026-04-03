import { z } from 'zod';
import { Units } from '../common';
import { ProcessingOperation, TimeseriesType } from './types';
/**
 * Represents a descriptor for a segment of a channel, including the channel information, start time, end time, and creation time.
 *
 * This schema is used to validate channel segment descriptors, ensuring that they conform to the expected structure and types.
 */
export declare const channelSegmentDescriptorSchema: z.ZodObject<{
    channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
        name: z.ZodString;
        effectiveAt: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        name: string;
        effectiveAt: number;
    }, {
        name: string;
        effectiveAt: number;
    }>]>;
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    creationTime: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    channel: (import("../station-definitions/channel-definitions").Channel | {
        name: string;
        effectiveAt: number;
    }) & (import("../station-definitions/channel-definitions").Channel | {
        name: string;
        effectiveAt: number;
    } | undefined);
    startTime: number;
    endTime: number;
    creationTime: number;
}, {
    channel: (import("../station-definitions/channel-definitions").Channel | {
        name: string;
        effectiveAt: number;
    }) & (import("../station-definitions/channel-definitions").Channel | {
        name: string;
        effectiveAt: number;
    } | undefined);
    startTime: number;
    endTime: number;
    creationTime: number;
}>;
/** A zod schema defining the {@link ChannelSegmentFaceted}. */
export declare const channelSegmentFacetedSchema: z.ZodObject<{
    id: z.ZodObject<{
        channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
            name: z.ZodString;
            effectiveAt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            name: string;
            effectiveAt: number;
        }, {
            name: string;
            effectiveAt: number;
        }>]>;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        creationTime: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    }, {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    }>;
}, "strict", z.ZodTypeAny, {
    id: {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    };
}, {
    id: {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    };
}>;
/** A zod schema defining the {@link ProcessingMask}. */
export declare const processingMaskSchema: z.ZodObject<{
    id: z.ZodString;
    effectiveAt: z.ZodNumber;
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    appliedToRawChannel: z.ZodObject<{
        name: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
    }, {
        name: string;
    }>;
    processingOperation: z.ZodNativeEnum<typeof ProcessingOperation>;
    maskedQcSegmentVersions: z.ZodArray<z.ZodObject<{
        id: z.ZodObject<{
            parentQcSegmentId: z.ZodString;
            effectiveAt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            effectiveAt: number;
            parentQcSegmentId: string;
        }, {
            effectiveAt: number;
            parentQcSegmentId: string;
        }>;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        createdBy: z.ZodString;
        rejected: z.ZodBoolean;
        rationale: z.ZodString;
        type: z.ZodOptional<z.ZodNativeEnum<typeof import("../qc-segment").QcSegmentType>>;
        discoveredOn: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodObject<{
                channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
                    name: z.ZodString;
                    effectiveAt: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    name: string;
                    effectiveAt: number;
                }, {
                    name: string;
                    effectiveAt: number;
                }>]>;
                startTime: z.ZodNumber;
                endTime: z.ZodNumber;
                creationTime: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            }, {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            id: {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            };
        }, {
            id: {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            };
        }>, "many">>;
        stageId: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            effectiveTime: z.ZodOptional<z.ZodNumber>;
        }, "strict", z.ZodTypeAny, {
            name: string;
            effectiveTime?: number | undefined;
        }, {
            name: string;
            effectiveTime?: number | undefined;
        }>>;
        category: z.ZodOptional<z.ZodNativeEnum<typeof import("../qc-segment").QcSegmentCategory>>;
        channels: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            effectiveAt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            name: string;
            effectiveAt: number;
        }, {
            name: string;
            effectiveAt: number;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: {
            effectiveAt: number;
            parentQcSegmentId: string;
        };
        channels: {
            name: string;
            effectiveAt: number;
        }[];
        startTime: number;
        endTime: number;
        rejected: boolean;
        createdBy: string;
        rationale: string;
        type?: import("../qc-segment").QcSegmentType | undefined;
        discoveredOn?: {
            id: {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            };
        }[] | undefined;
        stageId?: {
            name: string;
            effectiveTime?: number | undefined;
        } | undefined;
        category?: import("../qc-segment").QcSegmentCategory | undefined;
    }, {
        id: {
            effectiveAt: number;
            parentQcSegmentId: string;
        };
        channels: {
            name: string;
            effectiveAt: number;
        }[];
        startTime: number;
        endTime: number;
        rejected: boolean;
        createdBy: string;
        rationale: string;
        type?: import("../qc-segment").QcSegmentType | undefined;
        discoveredOn?: {
            id: {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            };
        }[] | undefined;
        stageId?: {
            name: string;
            effectiveTime?: number | undefined;
        } | undefined;
        category?: import("../qc-segment").QcSegmentCategory | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    id: string;
    effectiveAt: number;
    startTime: number;
    endTime: number;
    appliedToRawChannel: {
        name: string;
    };
    processingOperation: ProcessingOperation;
    maskedQcSegmentVersions: {
        id: {
            effectiveAt: number;
            parentQcSegmentId: string;
        };
        channels: {
            name: string;
            effectiveAt: number;
        }[];
        startTime: number;
        endTime: number;
        rejected: boolean;
        createdBy: string;
        rationale: string;
        type?: import("../qc-segment").QcSegmentType | undefined;
        discoveredOn?: {
            id: {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            };
        }[] | undefined;
        stageId?: {
            name: string;
            effectiveTime?: number | undefined;
        } | undefined;
        category?: import("../qc-segment").QcSegmentCategory | undefined;
    }[];
}, {
    id: string;
    effectiveAt: number;
    startTime: number;
    endTime: number;
    appliedToRawChannel: {
        name: string;
    };
    processingOperation: ProcessingOperation;
    maskedQcSegmentVersions: {
        id: {
            effectiveAt: number;
            parentQcSegmentId: string;
        };
        channels: {
            name: string;
            effectiveAt: number;
        }[];
        startTime: number;
        endTime: number;
        rejected: boolean;
        createdBy: string;
        rationale: string;
        type?: import("../qc-segment").QcSegmentType | undefined;
        discoveredOn?: {
            id: {
                channel: (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                }) & (import("../station-definitions/channel-definitions").Channel | {
                    name: string;
                    effectiveAt: number;
                } | undefined);
                startTime: number;
                endTime: number;
                creationTime: number;
            };
        }[] | undefined;
        stageId?: {
            name: string;
            effectiveTime?: number | undefined;
        } | undefined;
        category?: import("../qc-segment").QcSegmentCategory | undefined;
    }[];
}>;
/** A zod schema defining the {@link Timeseries}. */
export declare const timeseriesSchema: z.ZodObject<{
    type: z.ZodNativeEnum<typeof TimeseriesType>;
    startTime: z.ZodNumber;
    endTime: z.ZodNumber;
    sampleRateHz: z.ZodNumber;
    sampleCount: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    type: TimeseriesType;
    sampleRateHz: number;
    startTime: number;
    endTime: number;
    sampleCount: number;
}, {
    type: TimeseriesType;
    sampleRateHz: number;
    startTime: number;
    endTime: number;
    sampleCount: number;
}>;
/** A zod schema defining the {@link TimeRangesByChannel}. */
export declare const timeRangesByChannelSchema: z.ZodObject<{
    channel: z.ZodObject<{
        name: z.ZodString;
    }, "strict", z.ZodTypeAny, {
        name: string;
    }, {
        name: string;
    }>;
    timeRanges: z.ZodArray<z.ZodObject<{
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        startTime: number;
        endTime: number;
    }, {
        startTime: number;
        endTime: number;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    channel: {
        name: string;
    };
    timeRanges: {
        startTime: number;
        endTime: number;
    }[];
}, {
    channel: {
        name: string;
    };
    timeRanges: {
        startTime: number;
        endTime: number;
    }[];
}>;
/** A zod schema defining the {@link ChannelSegment}. */
export declare const channelSegmentSchema: z.ZodObject<{
    id: z.ZodObject<{
        channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
            name: z.ZodString;
            effectiveAt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            name: string;
            effectiveAt: number;
        }, {
            name: string;
            effectiveAt: number;
        }>]>;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        creationTime: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    }, {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    }>;
    units: z.ZodNativeEnum<typeof Units>;
    timeseriesType: z.ZodNativeEnum<typeof TimeseriesType>;
    timeseries: z.ZodArray<z.ZodObject<{
        type: z.ZodNativeEnum<typeof TimeseriesType>;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        sampleRateHz: z.ZodNumber;
        sampleCount: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        type: TimeseriesType;
        sampleRateHz: number;
        startTime: number;
        endTime: number;
        sampleCount: number;
    }, {
        type: TimeseriesType;
        sampleRateHz: number;
        startTime: number;
        endTime: number;
        sampleCount: number;
    }>, "many">;
    maskedBy: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        effectiveAt: z.ZodNumber;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        appliedToRawChannel: z.ZodObject<{
            name: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>;
        processingOperation: z.ZodNativeEnum<typeof ProcessingOperation>;
        maskedQcSegmentVersions: z.ZodArray<z.ZodObject<{
            id: z.ZodObject<{
                parentQcSegmentId: z.ZodString;
                effectiveAt: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                effectiveAt: number;
                parentQcSegmentId: string;
            }, {
                effectiveAt: number;
                parentQcSegmentId: string;
            }>;
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
            createdBy: z.ZodString;
            rejected: z.ZodBoolean;
            rationale: z.ZodString;
            type: z.ZodOptional<z.ZodNativeEnum<typeof import("../qc-segment").QcSegmentType>>;
            discoveredOn: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodObject<{
                    channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
                        name: z.ZodString;
                        effectiveAt: z.ZodNumber;
                    }, "strict", z.ZodTypeAny, {
                        name: string;
                        effectiveAt: number;
                    }, {
                        name: string;
                        effectiveAt: number;
                    }>]>;
                    startTime: z.ZodNumber;
                    endTime: z.ZodNumber;
                    creationTime: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                }, {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                }>;
            }, "strip", z.ZodTypeAny, {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }, {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }>, "many">>;
            stageId: z.ZodOptional<z.ZodObject<{
                name: z.ZodString;
                effectiveTime: z.ZodOptional<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                name: string;
                effectiveTime?: number | undefined;
            }, {
                name: string;
                effectiveTime?: number | undefined;
            }>>;
            category: z.ZodOptional<z.ZodNativeEnum<typeof import("../qc-segment").QcSegmentCategory>>;
            channels: z.ZodArray<z.ZodObject<{
                name: z.ZodString;
                effectiveAt: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                name: string;
                effectiveAt: number;
            }, {
                name: string;
                effectiveAt: number;
            }>, "many">;
        }, "strict", z.ZodTypeAny, {
            id: {
                effectiveAt: number;
                parentQcSegmentId: string;
            };
            channels: {
                name: string;
                effectiveAt: number;
            }[];
            startTime: number;
            endTime: number;
            rejected: boolean;
            createdBy: string;
            rationale: string;
            type?: import("../qc-segment").QcSegmentType | undefined;
            discoveredOn?: {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }[] | undefined;
            stageId?: {
                name: string;
                effectiveTime?: number | undefined;
            } | undefined;
            category?: import("../qc-segment").QcSegmentCategory | undefined;
        }, {
            id: {
                effectiveAt: number;
                parentQcSegmentId: string;
            };
            channels: {
                name: string;
                effectiveAt: number;
            }[];
            startTime: number;
            endTime: number;
            rejected: boolean;
            createdBy: string;
            rationale: string;
            type?: import("../qc-segment").QcSegmentType | undefined;
            discoveredOn?: {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }[] | undefined;
            stageId?: {
                name: string;
                effectiveTime?: number | undefined;
            } | undefined;
            category?: import("../qc-segment").QcSegmentCategory | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        id: string;
        effectiveAt: number;
        startTime: number;
        endTime: number;
        appliedToRawChannel: {
            name: string;
        };
        processingOperation: ProcessingOperation;
        maskedQcSegmentVersions: {
            id: {
                effectiveAt: number;
                parentQcSegmentId: string;
            };
            channels: {
                name: string;
                effectiveAt: number;
            }[];
            startTime: number;
            endTime: number;
            rejected: boolean;
            createdBy: string;
            rationale: string;
            type?: import("../qc-segment").QcSegmentType | undefined;
            discoveredOn?: {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }[] | undefined;
            stageId?: {
                name: string;
                effectiveTime?: number | undefined;
            } | undefined;
            category?: import("../qc-segment").QcSegmentCategory | undefined;
        }[];
    }, {
        id: string;
        effectiveAt: number;
        startTime: number;
        endTime: number;
        appliedToRawChannel: {
            name: string;
        };
        processingOperation: ProcessingOperation;
        maskedQcSegmentVersions: {
            id: {
                effectiveAt: number;
                parentQcSegmentId: string;
            };
            channels: {
                name: string;
                effectiveAt: number;
            }[];
            startTime: number;
            endTime: number;
            rejected: boolean;
            createdBy: string;
            rationale: string;
            type?: import("../qc-segment").QcSegmentType | undefined;
            discoveredOn?: {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }[] | undefined;
            stageId?: {
                name: string;
                effectiveTime?: number | undefined;
            } | undefined;
            category?: import("../qc-segment").QcSegmentCategory | undefined;
        }[];
    }>, "many">;
    missingInputChannels: z.ZodArray<z.ZodObject<{
        channel: z.ZodObject<{
            name: z.ZodString;
        }, "strict", z.ZodTypeAny, {
            name: string;
        }, {
            name: string;
        }>;
        timeRanges: z.ZodArray<z.ZodObject<{
            startTime: z.ZodNumber;
            endTime: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            startTime: number;
            endTime: number;
        }, {
            startTime: number;
            endTime: number;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        channel: {
            name: string;
        };
        timeRanges: {
            startTime: number;
            endTime: number;
        }[];
    }, {
        channel: {
            name: string;
        };
        timeRanges: {
            startTime: number;
            endTime: number;
        }[];
    }>, "many">;
    _uiFilterDefinitionName: z.ZodOptional<z.ZodString>;
    _uiFiltersBySampleRate: z.ZodOptional<z.ZodRecord<z.ZodNumber, z.ZodObject<{
        name: z.ZodString;
        comments: z.ZodOptional<z.ZodString>;
        filterDescription: z.ZodUnion<[z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
            filterType: z.ZodLiteral<import("../filter").FilterType.AUTOREGRESSIVE>;
            order: z.ZodNumber;
            noiseWindowDuration: z.ZodNumber;
            noiseWindowOffset: z.ZodNumber;
            signalWindowDuration: z.ZodOptional<z.ZodNumber>;
            signalWindowOffset: z.ZodNumber;
            autoregressiveType: z.ZodNativeEnum<typeof import("../filter").AutoregressiveType>;
            autoregressiveFilterType: z.ZodNativeEnum<typeof import("../filter").AutoregressiveFilterType>;
            parameters: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                sampleRateHz: z.ZodNumber;
                sampleRateToleranceHz: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            }, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            }>, z.ZodObject<{
                coefficients: z.ZodArray<z.ZodNumber, "many">;
                noiseWindow: z.ZodObject<{
                    channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
                        name: z.ZodString;
                        effectiveAt: z.ZodNumber;
                    }, "strict", z.ZodTypeAny, {
                        name: string;
                        effectiveAt: number;
                    }, {
                        name: string;
                        effectiveAt: number;
                    }>]>;
                    startTime: z.ZodNumber;
                    endTime: z.ZodNumber;
                    creationTime: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                }, {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                }>;
                sampleRateHz: z.ZodNumber;
                sampleRateToleranceHz: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }>]>>;
            comments: z.ZodOptional<z.ZodString>;
            causal: z.ZodBoolean;
            correctGroupDelay: z.ZodBoolean;
            response: z.ZodOptional<z.ZodObject<{
                amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
                    amplitude: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                    phase: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
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
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }>>;
                nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }>>;
        }, "strict", z.ZodTypeAny, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, z.ZodObject<{
            filterType: z.ZodLiteral<import("../filter").FilterType.CASCADE>;
            filterDescriptions: z.ZodArray<z.ZodUnion<[z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
                filterType: z.ZodLiteral<import("../filter").FilterType.LINEAR>;
                lowFrequencyHz: z.ZodOptional<z.ZodNumber>;
                highFrequencyHz: z.ZodOptional<z.ZodNumber>;
                order: z.ZodNumber;
                zeroPhase: z.ZodBoolean;
                passBandType: z.ZodNativeEnum<typeof import("../filter").BandType>;
                linearFilterType: z.ZodNativeEnum<typeof import("../filter").LinearFilterType>;
                parameters: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                    sampleRateHz: z.ZodNumber;
                    sampleRateToleranceHz: z.ZodNumber;
                    groupDelaySec: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                }, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                }>, z.ZodObject<{
                    sosNumeratorCoefficients: z.ZodArray<z.ZodNumber, "many">;
                    sosDenominatorCoefficients: z.ZodArray<z.ZodNumber, "many">;
                    transferFunctionBCoefficients: z.ZodOptional<z.ZodUndefined>;
                    sampleRateHz: z.ZodNumber;
                    sampleRateToleranceHz: z.ZodNumber;
                    groupDelaySec: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                }, {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                }>, z.ZodObject<{
                    transferFunctionBCoefficients: z.ZodArray<z.ZodNumber, "many">;
                    sosNumeratorCoefficients: z.ZodOptional<z.ZodUndefined>;
                    sosDenominatorCoefficients: z.ZodOptional<z.ZodUndefined>;
                    sampleRateHz: z.ZodNumber;
                    sampleRateToleranceHz: z.ZodNumber;
                    groupDelaySec: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                }, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                }>]>>;
                comments: z.ZodOptional<z.ZodString>;
                causal: z.ZodBoolean;
                correctGroupDelay: z.ZodBoolean;
                response: z.ZodOptional<z.ZodObject<{
                    amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
                        amplitude: z.ZodObject<{
                            value: z.ZodNumber;
                            standardDeviation: z.ZodOptional<z.ZodNumber>;
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                        phase: z.ZodObject<{
                            value: z.ZodNumber;
                            standardDeviation: z.ZodOptional<z.ZodNumber>;
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                    }, "strict", z.ZodTypeAny, {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }, {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
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
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                    }, "strict", z.ZodTypeAny, {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }, {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }>>;
                    nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
                }, "strict", z.ZodTypeAny, {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                }, {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                }>>;
            }, "strict", z.ZodTypeAny, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
                dispersionModelName: z.ZodString;
                frequencyTaperFunction: z.ZodNativeEnum<typeof import("../filter").TaperFunction>;
                highFrequencyHz: z.ZodNumber;
                highFrequencyTaperWidthHz: z.ZodNumber;
                lowFrequencyHz: z.ZodNumber;
                lowFrequencyTaperWidthHz: z.ZodNumber;
                numFrequencies: z.ZodNumber;
                filterType: z.ZodLiteral<import("../filter").FilterType.PHASE_MATCH>;
                phase: z.ZodString;
                referencePeriod: z.ZodNumber;
                parameters: z.ZodOptional<z.ZodObject<{
                    receiverLocation: z.ZodObject<{
                        latitudeDegrees: z.ZodNumber;
                        longitudeDegrees: z.ZodNumber;
                        elevationKm: z.ZodNumber;
                        depthKm: z.ZodNumber;
                    }, "strict", z.ZodTypeAny, {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    }, {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    }>;
                    sourceLocation: z.ZodObject<{
                        depthKm: z.ZodNumber;
                        latitudeDegrees: z.ZodNumber;
                        longitudeDegrees: z.ZodNumber;
                        time: z.ZodNumber;
                    }, "strict", z.ZodTypeAny, {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    }, {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                }, {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                }>>;
                comments: z.ZodOptional<z.ZodString>;
                causal: z.ZodBoolean;
                correctGroupDelay: z.ZodBoolean;
                response: z.ZodOptional<z.ZodObject<{
                    amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
                        amplitude: z.ZodObject<{
                            value: z.ZodNumber;
                            standardDeviation: z.ZodOptional<z.ZodNumber>;
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                        phase: z.ZodObject<{
                            value: z.ZodNumber;
                            standardDeviation: z.ZodOptional<z.ZodNumber>;
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                    }, "strict", z.ZodTypeAny, {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }, {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
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
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                    }, "strict", z.ZodTypeAny, {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }, {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }>>;
                    nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
                }, "strict", z.ZodTypeAny, {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                }, {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                }>>;
            }, "strict", z.ZodTypeAny, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
                filterType: z.ZodLiteral<import("../filter").FilterType.AUTOREGRESSIVE>;
                order: z.ZodNumber;
                noiseWindowDuration: z.ZodNumber;
                noiseWindowOffset: z.ZodNumber;
                signalWindowDuration: z.ZodOptional<z.ZodNumber>;
                signalWindowOffset: z.ZodNumber;
                autoregressiveType: z.ZodNativeEnum<typeof import("../filter").AutoregressiveType>;
                autoregressiveFilterType: z.ZodNativeEnum<typeof import("../filter").AutoregressiveFilterType>;
                parameters: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                    sampleRateHz: z.ZodNumber;
                    sampleRateToleranceHz: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                }, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                }>, z.ZodObject<{
                    coefficients: z.ZodArray<z.ZodNumber, "many">;
                    noiseWindow: z.ZodObject<{
                        channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
                            name: z.ZodString;
                            effectiveAt: z.ZodNumber;
                        }, "strict", z.ZodTypeAny, {
                            name: string;
                            effectiveAt: number;
                        }, {
                            name: string;
                            effectiveAt: number;
                        }>]>;
                        startTime: z.ZodNumber;
                        endTime: z.ZodNumber;
                        creationTime: z.ZodNumber;
                    }, "strict", z.ZodTypeAny, {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    }, {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    }>;
                    sampleRateHz: z.ZodNumber;
                    sampleRateToleranceHz: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                }, {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                }>]>>;
                comments: z.ZodOptional<z.ZodString>;
                causal: z.ZodBoolean;
                correctGroupDelay: z.ZodBoolean;
                response: z.ZodOptional<z.ZodObject<{
                    amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
                        amplitude: z.ZodObject<{
                            value: z.ZodNumber;
                            standardDeviation: z.ZodOptional<z.ZodNumber>;
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                        phase: z.ZodObject<{
                            value: z.ZodNumber;
                            standardDeviation: z.ZodOptional<z.ZodNumber>;
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                    }, "strict", z.ZodTypeAny, {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }, {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
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
                            units: z.ZodNativeEnum<typeof Units>;
                        }, "strict", z.ZodTypeAny, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }, {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        }>;
                    }, "strict", z.ZodTypeAny, {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }, {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }>>;
                    nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
                }, "strict", z.ZodTypeAny, {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                }, {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                }>>;
            }, "strict", z.ZodTypeAny, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }, {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            }>]>, "many">;
            parameters: z.ZodOptional<z.ZodObject<{
                sampleRateHz: z.ZodNumber;
                sampleRateToleranceHz: z.ZodNumber;
                groupDelaySec: z.ZodOptional<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            }, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            }>>;
            comments: z.ZodOptional<z.ZodString>;
            causal: z.ZodBoolean;
            correctGroupDelay: z.ZodBoolean;
            response: z.ZodOptional<z.ZodObject<{
                amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
                    amplitude: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                    phase: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
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
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }>>;
                nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }>>;
        }, "strict", z.ZodTypeAny, {
            filterType: import("../filter").FilterType.CASCADE;
            causal: boolean;
            correctGroupDelay: boolean;
            filterDescriptions: ({
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            })[];
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.CASCADE;
            causal: boolean;
            correctGroupDelay: boolean;
            filterDescriptions: ({
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            })[];
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
            filterType: z.ZodLiteral<import("../filter").FilterType.LINEAR>;
            lowFrequencyHz: z.ZodOptional<z.ZodNumber>;
            highFrequencyHz: z.ZodOptional<z.ZodNumber>;
            order: z.ZodNumber;
            zeroPhase: z.ZodBoolean;
            passBandType: z.ZodNativeEnum<typeof import("../filter").BandType>;
            linearFilterType: z.ZodNativeEnum<typeof import("../filter").LinearFilterType>;
            parameters: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
                sampleRateHz: z.ZodNumber;
                sampleRateToleranceHz: z.ZodNumber;
                groupDelaySec: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            }, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            }>, z.ZodObject<{
                sosNumeratorCoefficients: z.ZodArray<z.ZodNumber, "many">;
                sosDenominatorCoefficients: z.ZodArray<z.ZodNumber, "many">;
                transferFunctionBCoefficients: z.ZodOptional<z.ZodUndefined>;
                sampleRateHz: z.ZodNumber;
                sampleRateToleranceHz: z.ZodNumber;
                groupDelaySec: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            }, {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            }>, z.ZodObject<{
                transferFunctionBCoefficients: z.ZodArray<z.ZodNumber, "many">;
                sosNumeratorCoefficients: z.ZodOptional<z.ZodUndefined>;
                sosDenominatorCoefficients: z.ZodOptional<z.ZodUndefined>;
                sampleRateHz: z.ZodNumber;
                sampleRateToleranceHz: z.ZodNumber;
                groupDelaySec: z.ZodNumber;
            }, "strict", z.ZodTypeAny, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            }, {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            }>]>>;
            comments: z.ZodOptional<z.ZodString>;
            causal: z.ZodBoolean;
            correctGroupDelay: z.ZodBoolean;
            response: z.ZodOptional<z.ZodObject<{
                amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
                    amplitude: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                    phase: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
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
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }>>;
                nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }>>;
        }, "strict", z.ZodTypeAny, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
            dispersionModelName: z.ZodString;
            frequencyTaperFunction: z.ZodNativeEnum<typeof import("../filter").TaperFunction>;
            highFrequencyHz: z.ZodNumber;
            highFrequencyTaperWidthHz: z.ZodNumber;
            lowFrequencyHz: z.ZodNumber;
            lowFrequencyTaperWidthHz: z.ZodNumber;
            numFrequencies: z.ZodNumber;
            filterType: z.ZodLiteral<import("../filter").FilterType.PHASE_MATCH>;
            phase: z.ZodString;
            referencePeriod: z.ZodNumber;
            parameters: z.ZodOptional<z.ZodObject<{
                receiverLocation: z.ZodObject<{
                    latitudeDegrees: z.ZodNumber;
                    longitudeDegrees: z.ZodNumber;
                    elevationKm: z.ZodNumber;
                    depthKm: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                }, {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                }>;
                sourceLocation: z.ZodObject<{
                    depthKm: z.ZodNumber;
                    latitudeDegrees: z.ZodNumber;
                    longitudeDegrees: z.ZodNumber;
                    time: z.ZodNumber;
                }, "strict", z.ZodTypeAny, {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                }, {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                }>;
            }, "strict", z.ZodTypeAny, {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            }, {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            }>>;
            comments: z.ZodOptional<z.ZodString>;
            causal: z.ZodBoolean;
            correctGroupDelay: z.ZodBoolean;
            response: z.ZodOptional<z.ZodObject<{
                amplitudePhaseResponses: z.ZodArray<z.ZodObject<{
                    amplitude: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                    phase: z.ZodObject<{
                        value: z.ZodNumber;
                        standardDeviation: z.ZodOptional<z.ZodNumber>;
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
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
                        units: z.ZodNativeEnum<typeof Units>;
                    }, "strict", z.ZodTypeAny, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }, {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    }>;
                }, "strict", z.ZodTypeAny, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }, {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }>>;
                nominalSampleRateHz: z.ZodOptional<z.ZodNumber>;
            }, "strict", z.ZodTypeAny, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }, {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            }>>;
        }, "strict", z.ZodTypeAny, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }, {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        }>]>;
    }, "strict", z.ZodTypeAny, {
        name: string;
        filterDescription: {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.CASCADE;
            causal: boolean;
            correctGroupDelay: boolean;
            filterDescriptions: ({
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            })[];
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        };
        comments?: string | undefined;
    }, {
        name: string;
        filterDescription: {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.CASCADE;
            causal: boolean;
            correctGroupDelay: boolean;
            filterDescriptions: ({
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            })[];
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        };
        comments?: string | undefined;
    }>>>;
    _uiConfiguredInput: z.ZodOptional<z.ZodObject<{
        channel: z.ZodUnion<[z.ZodType<import("../station-definitions/channel-definitions").Channel, z.ZodTypeDef, import("../station-definitions/channel-definitions").Channel>, z.ZodObject<{
            name: z.ZodString;
            effectiveAt: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            name: string;
            effectiveAt: number;
        }, {
            name: string;
            effectiveAt: number;
        }>]>;
        startTime: z.ZodNumber;
        endTime: z.ZodNumber;
        creationTime: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    }, {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    }>>;
}, "strict", z.ZodTypeAny, {
    id: {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    };
    units: Units;
    timeseriesType: TimeseriesType;
    timeseries: {
        type: TimeseriesType;
        sampleRateHz: number;
        startTime: number;
        endTime: number;
        sampleCount: number;
    }[];
    maskedBy: {
        id: string;
        effectiveAt: number;
        startTime: number;
        endTime: number;
        appliedToRawChannel: {
            name: string;
        };
        processingOperation: ProcessingOperation;
        maskedQcSegmentVersions: {
            id: {
                effectiveAt: number;
                parentQcSegmentId: string;
            };
            channels: {
                name: string;
                effectiveAt: number;
            }[];
            startTime: number;
            endTime: number;
            rejected: boolean;
            createdBy: string;
            rationale: string;
            type?: import("../qc-segment").QcSegmentType | undefined;
            discoveredOn?: {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }[] | undefined;
            stageId?: {
                name: string;
                effectiveTime?: number | undefined;
            } | undefined;
            category?: import("../qc-segment").QcSegmentCategory | undefined;
        }[];
    }[];
    missingInputChannels: {
        channel: {
            name: string;
        };
        timeRanges: {
            startTime: number;
            endTime: number;
        }[];
    }[];
    _uiFilterDefinitionName?: string | undefined;
    _uiFiltersBySampleRate?: Record<number, {
        name: string;
        filterDescription: {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.CASCADE;
            causal: boolean;
            correctGroupDelay: boolean;
            filterDescriptions: ({
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            })[];
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        };
        comments?: string | undefined;
    }> | undefined;
    _uiConfiguredInput?: {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    } | undefined;
}, {
    id: {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    };
    units: Units;
    timeseriesType: TimeseriesType;
    timeseries: {
        type: TimeseriesType;
        sampleRateHz: number;
        startTime: number;
        endTime: number;
        sampleCount: number;
    }[];
    maskedBy: {
        id: string;
        effectiveAt: number;
        startTime: number;
        endTime: number;
        appliedToRawChannel: {
            name: string;
        };
        processingOperation: ProcessingOperation;
        maskedQcSegmentVersions: {
            id: {
                effectiveAt: number;
                parentQcSegmentId: string;
            };
            channels: {
                name: string;
                effectiveAt: number;
            }[];
            startTime: number;
            endTime: number;
            rejected: boolean;
            createdBy: string;
            rationale: string;
            type?: import("../qc-segment").QcSegmentType | undefined;
            discoveredOn?: {
                id: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            }[] | undefined;
            stageId?: {
                name: string;
                effectiveTime?: number | undefined;
            } | undefined;
            category?: import("../qc-segment").QcSegmentCategory | undefined;
        }[];
    }[];
    missingInputChannels: {
        channel: {
            name: string;
        };
        timeRanges: {
            startTime: number;
            endTime: number;
        }[];
    }[];
    _uiFilterDefinitionName?: string | undefined;
    _uiFiltersBySampleRate?: Record<number, {
        name: string;
        filterDescription: {
            filterType: import("../filter").FilterType.LINEAR;
            order: number;
            zeroPhase: boolean;
            causal: boolean;
            correctGroupDelay: boolean;
            passBandType: import("../filter").BandType;
            linearFilterType: import("../filter").LinearFilterType;
            lowFrequencyHz?: number | undefined;
            highFrequencyHz?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
            } | {
                sosDenominatorCoefficients: number[];
                sosNumeratorCoefficients: number[];
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients?: undefined;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec: number;
                transferFunctionBCoefficients: number[];
                sosNumeratorCoefficients?: undefined;
                sosDenominatorCoefficients?: undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.AUTOREGRESSIVE;
            order: number;
            causal: boolean;
            correctGroupDelay: boolean;
            noiseWindowDuration: number;
            noiseWindowOffset: number;
            signalWindowOffset: number;
            autoregressiveType: import("../filter").AutoregressiveType;
            autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
            signalWindowDuration?: number | undefined;
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
            } | {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                coefficients: number[];
                noiseWindow: {
                    channel: (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    }) & (import("../station-definitions/channel-definitions").Channel | {
                        name: string;
                        effectiveAt: number;
                    } | undefined);
                    startTime: number;
                    endTime: number;
                    creationTime: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.PHASE_MATCH;
            lowFrequencyHz: number;
            highFrequencyHz: number;
            phase: string;
            causal: boolean;
            correctGroupDelay: boolean;
            dispersionModelName: string;
            lowFrequencyTaperWidthHz: number;
            highFrequencyTaperWidthHz: number;
            numFrequencies: number;
            referencePeriod: number;
            frequencyTaperFunction: import("../filter").TaperFunction;
            parameters?: {
                receiverLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    elevationKm: number;
                    depthKm: number;
                };
                sourceLocation: {
                    latitudeDegrees: number;
                    longitudeDegrees: number;
                    depthKm: number;
                    time: number;
                };
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        } | {
            filterType: import("../filter").FilterType.CASCADE;
            causal: boolean;
            correctGroupDelay: boolean;
            filterDescriptions: ({
                filterType: import("../filter").FilterType.LINEAR;
                order: number;
                zeroPhase: boolean;
                causal: boolean;
                correctGroupDelay: boolean;
                passBandType: import("../filter").BandType;
                linearFilterType: import("../filter").LinearFilterType;
                lowFrequencyHz?: number | undefined;
                highFrequencyHz?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                } | {
                    sosDenominatorCoefficients: number[];
                    sosNumeratorCoefficients: number[];
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients?: undefined;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    groupDelaySec: number;
                    transferFunctionBCoefficients: number[];
                    sosNumeratorCoefficients?: undefined;
                    sosDenominatorCoefficients?: undefined;
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.AUTOREGRESSIVE;
                order: number;
                causal: boolean;
                correctGroupDelay: boolean;
                noiseWindowDuration: number;
                noiseWindowOffset: number;
                signalWindowOffset: number;
                autoregressiveType: import("../filter").AutoregressiveType;
                autoregressiveFilterType: import("../filter").AutoregressiveFilterType;
                signalWindowDuration?: number | undefined;
                parameters?: {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                } | {
                    sampleRateHz: number;
                    sampleRateToleranceHz: number;
                    coefficients: number[];
                    noiseWindow: {
                        channel: (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        }) & (import("../station-definitions/channel-definitions").Channel | {
                            name: string;
                            effectiveAt: number;
                        } | undefined);
                        startTime: number;
                        endTime: number;
                        creationTime: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            } | {
                filterType: import("../filter").FilterType.PHASE_MATCH;
                lowFrequencyHz: number;
                highFrequencyHz: number;
                phase: string;
                causal: boolean;
                correctGroupDelay: boolean;
                dispersionModelName: string;
                lowFrequencyTaperWidthHz: number;
                highFrequencyTaperWidthHz: number;
                numFrequencies: number;
                referencePeriod: number;
                frequencyTaperFunction: import("../filter").TaperFunction;
                parameters?: {
                    receiverLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        elevationKm: number;
                        depthKm: number;
                    };
                    sourceLocation: {
                        latitudeDegrees: number;
                        longitudeDegrees: number;
                        depthKm: number;
                        time: number;
                    };
                } | undefined;
                comments?: string | undefined;
                response?: {
                    id: string;
                    amplitudePhaseResponses: {
                        amplitude: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                        phase: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    }[];
                    frequencies: number[];
                    nominalCalibration?: {
                        calibrationPeriodSec: number;
                        calibrationTimeShift: number;
                        calibrationFactor: {
                            units: Units;
                            value: number;
                            standardDeviation?: number | undefined;
                        };
                    } | undefined;
                    nominalSampleRateHz?: number | undefined;
                } | undefined;
            })[];
            parameters?: {
                sampleRateHz: number;
                sampleRateToleranceHz: number;
                groupDelaySec?: number | undefined;
            } | undefined;
            comments?: string | undefined;
            response?: {
                id: string;
                amplitudePhaseResponses: {
                    amplitude: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                    phase: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                }[];
                frequencies: number[];
                nominalCalibration?: {
                    calibrationPeriodSec: number;
                    calibrationTimeShift: number;
                    calibrationFactor: {
                        units: Units;
                        value: number;
                        standardDeviation?: number | undefined;
                    };
                } | undefined;
                nominalSampleRateHz?: number | undefined;
            } | undefined;
        };
        comments?: string | undefined;
    }> | undefined;
    _uiConfiguredInput?: {
        channel: (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        }) & (import("../station-definitions/channel-definitions").Channel | {
            name: string;
            effectiveAt: number;
        } | undefined);
        startTime: number;
        endTime: number;
        creationTime: number;
    } | undefined;
}>;
/** A zod schema defining the {@link FdsnWaveform}. */
export declare const fdsnWaveformSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    data: z.ZodArray<z.ZodNumber, "many">;
    channel: z.ZodString;
    station: z.ZodString;
    location: z.ZodString;
    storage: z.ZodString;
    sampleRate: z.ZodNumber;
    numberOfSamples: z.ZodNumber;
    timestamp: z.ZodString;
    network: z.ZodString;
}, "strict", z.ZodTypeAny, {
    sampleRate: number;
    station: string;
    location: string;
    data: number[];
    channel: string;
    storage: string;
    numberOfSamples: number;
    timestamp: string;
    network: string;
}, {
    sampleRate: number;
    station: string;
    location: string;
    data: number[];
    channel: string;
    storage: string;
    numberOfSamples: number;
    timestamp: string;
    network: string;
}>, {
    sampleRate: number;
    station: string;
    location: string;
    data: number[];
    channel: string;
    storage: string;
    numberOfSamples: number;
    timestamp: string;
    network: string;
}, {
    sampleRate: number;
    station: string;
    location: string;
    data: number[];
    channel: string;
    storage: string;
    numberOfSamples: number;
    timestamp: string;
    network: string;
}>, {
    sampleRate: number;
    station: string;
    location: string;
    data: number[];
    channel: string;
    storage: string;
    numberOfSamples: number;
    timestamp: string;
    network: string;
}, {
    sampleRate: number;
    station: string;
    location: string;
    data: number[];
    channel: string;
    storage: string;
    numberOfSamples: number;
    timestamp: string;
    network: string;
}>;
//# sourceMappingURL=schema.d.ts.map