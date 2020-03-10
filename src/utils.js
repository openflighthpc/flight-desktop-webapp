//
// Return a new reducer which calls each provided reducer in turn.
//
export function reduceReducers(...reducers) {
  return (state, action) => (
    reducers.reduceRight(
      (newState, nextReducer) => nextReducer(newState, action),
      state,
    )
  );
}
