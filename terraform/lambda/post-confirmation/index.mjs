// Creates the app's user row after Cognito confirms a sign-up, so the client
// can load the user by cognitoId.
export const handler = async (event) => {
  // Cognito also runs this trigger after a password reset; only a new sign-up
  // needs a user row.
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
    return event;
  }

  const response = await fetch(`${process.env.API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: event.userName,
      cognitoId: event.request.userAttributes.sub,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Creating the user row failed with status ${response.status}`,
    );
  }

  return event;
};
