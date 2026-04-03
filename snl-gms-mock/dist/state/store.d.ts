export declare const store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    analyst: import("./reducers/analyst-slice").AnalystState;
}, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("@reduxjs/toolkit").ThunkMiddleware<{
    analyst: import("./reducers/analyst-slice").AnalystState;
}, import("redux").AnyAction>]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
//# sourceMappingURL=store.d.ts.map