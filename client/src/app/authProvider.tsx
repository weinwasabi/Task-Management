"use client";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { I18n } from "aws-amplify/utils";
import { ArrowLeft, Layers3 } from "lucide-react";
import { APP_NAME } from "@/lib/branding";
import type { ReactNode } from "react";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
const configuredEndpoint = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ENDPOINT;

// The local proxy is browser-facing. In AWS, leave the endpoint unset to use Cognito directly.
const userPoolEndpoint = configuredEndpoint?.startsWith("/")
  ? typeof window === "undefined"
    ? undefined
    : new URL(configuredEndpoint, window.location.origin).toString()
  : configuredEndpoint;

if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: { userPoolId, userPoolClientId, userPoolEndpoint },
    },
  });
}

I18n.setLanguage("en");
I18n.putVocabulariesForLanguage("en", {
  "Your code is on the way. To log in, enter the code we sent you":
    "Check your email for the confirmation code",
  "Your code is on the way. To log in, enter the code we emailed to":
    "Enter the confirmation code sent to",
  "Your code is on the way. To log in, enter the code we texted to":
    "Enter the confirmation code sent to",
  "Resend Code": "Resend code",
});

const formFields = {
  signIn: {
    username: {
      label: "Username",
      placeholder: "Enter your username",
      isRequired: true,
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      label: "Username",
      placeholder: "Choose a username",
      isRequired: true,
    },
    email: {
      order: 2,
      label: "Email address",
      placeholder: "you@example.com",
      isRequired: true,
    },
    password: {
      order: 3,
      label: "Password",
      placeholder: "Create a password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      label: "Confirm password",
      placeholder: "Enter your password again",
      isRequired: true,
    },
  },
  forgotPassword: {
    username: { label: "Username", placeholder: "Enter your username" },
  },
  confirmSignUp: {
    confirmation_code: {
      label: "Confirmation code",
      placeholder: "Enter the code from your email",
    },
  },
};

function AuthFormHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="auth-form-heading">
      <p className="app-kicker">{kicker}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

const components = {
  Header() {
    return (
      <div className="auth-intro">
        <div className="auth-brand">
          <span className="auth-brand-mark">
            <Layers3 aria-hidden="true" size={19} />
          </span>
          <span>{APP_NAME}</span>
        </div>
        <div className="auth-intro-copy">
          <p className="app-kicker">ONE WORKSPACE / EVERY PROJECT</p>
          <h1>
            Plan the work.
            <br />
            See the progress.
          </h1>
          <p>
            Keep projects, tasks, and timelines together, so your next step is
            always clear.
          </p>
        </div>
        <p className="auth-intro-foot">
          PROJECTS <span aria-hidden="true">/</span> TASKS{" "}
          <span aria-hidden="true">/</span> TIMELINES
        </p>
      </div>
    );
  },
  SignIn: {
    Header() {
      return (
        <AuthFormHeading
          kicker="YOUR WORKSPACE"
          title="Welcome back"
          description="Sign in with your username and password."
        />
      );
    },
  },
  SignUp: {
    Header() {
      return (
        <AuthFormHeading
          kicker="GET STARTED"
          title="Create your account"
          description="Use a username and email to create your workspace account."
        />
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      const { toSignIn } = useAuthenticator((context) => [context.toSignIn]);

      return (
        <div className="auth-confirm-heading">
          <button className="auth-back-button" type="button" onClick={toSignIn}>
            <ArrowLeft aria-hidden="true" size={16} />
            Back to sign in
          </button>
          <AuthFormHeading
            kicker="ONE MORE STEP"
            title="Confirm your account"
            description="Use the code below to finish creating your account."
          />
        </div>
      );
    },
  },
  ForgotPassword: {
    Header() {
      return (
        <AuthFormHeading
          kicker="ACCOUNT RECOVERY"
          title="Reset your password"
          description="Enter your username to request a reset code."
        />
      );
    },
  },
  ConfirmResetPassword: {
    Header() {
      return (
        <AuthFormHeading
          kicker="ACCOUNT RECOVERY"
          title="Set a new password"
          description="Enter the reset code and choose a new password."
        />
      );
    },
  },
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  if (!userPoolId || !userPoolClientId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas px-4">
        <div className="app-panel max-w-md p-6">
          <p className="app-kicker">AUTH SETUP</p>
          <h1 className="mt-3 text-xl font-semibold">
            Sign-in is not configured
          </h1>
          <p className="mt-2 text-sm text-muted">
            Set the Cognito user pool ID and app client ID in the client
            environment, then restart the app.
          </p>
        </div>
      </main>
    );
  }

  return (
    <Authenticator
      className="app-authenticator"
      components={components}
      formFields={formFields}
      loginMechanisms={["username"]}
      signUpAttributes={["email"]}
    >
      {children}
    </Authenticator>
  );
}
