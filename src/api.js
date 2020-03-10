


export const signIn = (userDispatch, sessionsDispatch) => async (inputs) => {
  // XXX Transition to authenticated dashboard.
  userDispatch({
    type: 'SIGN_IN',
    payload: { username: inputs.username, password: inputs.password }
  });

  sessionsDispatch({ type: 'LOAD' });
  const sessions = await retrieveFakeSessions();
  sessionsDispatch({
    type: 'RESOLVED',
    payload: sessions,
  });
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
