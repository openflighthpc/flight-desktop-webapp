export const signIn = (userActions, sessionActions) => async (inputs) => {
  userActions.setUser(inputs.username, inputs.password);
}

export async function retrievSessions(sessionActions) {
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
      },
      {
        "id": "6fe6f4ed-b442-4703-ad47-075bc3f61835",
        "type": "terminal",
        "image": null,
      }
    ];
    setTimeout(() => resolve(fakeData), 2000);
  });
  return await promise;
}
