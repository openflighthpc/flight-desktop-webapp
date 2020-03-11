export const signIn = (userActions, sessionActions) => async (inputs) => {
  // XXX Transition to authenticated dashboard.
  userActions.setUser(inputs.username, inputs.password);

  sessionActions.pending();
  const sessions = await retrieveFakeSessions();
  sessionActions.resolved(sessions);
}

async function retrieveFakeSessions() {
  const promise = new Promise((resolve, reject) => {
    const fakeData = [
      {
        "id": "1740a970-73e2-42bb-b740-baadb333175d",
        "type": "terminal",
        "image": null,
      }
    ];
    setTimeout(() => resolve(fakeData), 2000);
  });
  return await promise;
}
