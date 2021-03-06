import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";
import mediaMiddleware from "./mediaMiddleware";
import { merge } from "./utils";
import { UPDATE_TIME_ELAPSED, STEP_MARQUEE } from "./actionTypes";

const compose = composeWithDevTools({
  actionsBlacklist: [UPDATE_TIME_ELAPSED, STEP_MARQUEE]
});

export default function(
  media,
  actionEmitter,
  customMiddlewares = [],
  stateOverrides,
  extras
) {
  let initialState;
  if (stateOverrides) {
    initialState = merge(
      reducer(undefined, { type: "@@init" }),
      stateOverrides
    );
  }

  // eslint-disable-next-line no-unused-vars
  const emitterMiddleware = store => next => action => {
    actionEmitter.trigger(action.type, action);
    return next(action);
  };

  return createStore(
    reducer,
    initialState,
    compose(
      applyMiddleware(
        ...[
          thunk.withExtraArgument(extras),
          mediaMiddleware(media),
          emitterMiddleware,
          ...customMiddlewares
        ].filter(Boolean)
      )
    )
  );
}
