const localstackEndpoint = process.env.COGNITO_LOCALSTACK_ENDPOINT;

export async function POST(request: Request) {
  if (!localstackEndpoint) {
    return new Response("LocalStack Cognito endpoint is not configured", {
      status: 404,
    });
  }

  const target = request.headers.get("x-amz-target");
  if (!target?.startsWith("AWSCognitoIdentityProviderService.")) {
    return new Response("Invalid Cognito operation", { status: 400 });
  }

  try {
    const response = await fetch(localstackEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": target,
      },
      body: await request.text(),
      cache: "no-store",
    });

    const headers = new Headers();
    for (const name of ["content-type", "x-amzn-errortype", "x-amzn-requestid"]) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new Response(response.body, { status: response.status, headers });
  } catch {
    return new Response("LocalStack Cognito is unavailable", { status: 502 });
  }
}
