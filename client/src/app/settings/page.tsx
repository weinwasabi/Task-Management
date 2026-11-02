"use client";

import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setThemePreference, type initialStateTypes } from "@/state";
import { useGetAuthUserQuery, useGetTeamsQuery } from "@/state/api";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";

export default function Settings() {
  const dispatch = useAppDispatch();
  const themePreference = useAppSelector(
    (state) => state.global.themePreference,
  );
  const { data: account, isLoading, isError } = useGetAuthUserQuery({});
  const { data: teams } = useGetTeamsQuery();
  const [email, setEmail] = useState("Loading...");

  useEffect(() => {
    let active = true;
    fetchUserAttributes()
      .then((attributes) => {
        if (active) setEmail(attributes.email ?? "No email on this account");
      })
      .catch(() => {
        if (active) setEmail("Email unavailable");
      });
    return () => {
      active = false;
    };
  }, []);

  const team = teams?.find((item) => item.id === account?.userDetails?.teamId);

  return (
    <div className="app-page">
      <Header name="Settings" />
      <div className="grid max-w-4xl gap-5 md:grid-cols-2">
        <section className="app-panel p-5">
          <h2 className="mb-5 text-lg font-semibold text-ink">
            Account details
          </h2>
          {isLoading ? (
            <p className="text-muted">Loading account...</p>
          ) : isError || !account ? (
            <p role="alert" className="text-ink">
              Could not load your account.
            </p>
          ) : (
            <dl className="space-y-4">
              {[
                {
                  label: "Username",
                  value: account.userDetails?.username ?? account.user.username,
                },
                { label: "Email", value: email },
                { label: "Team", value: team?.teamName ?? "No team assigned" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="app-label">{label}</dt>
                  <dd className="mt-1 border-b border-line pb-3 text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
        <section className="app-panel p-5">
          <h2 className="mb-5 text-lg font-semibold text-ink">Appearance</h2>
          <label htmlFor="theme-preference" className="app-label">
            Theme
          </label>
          <select
            id="theme-preference"
            className="app-input"
            value={themePreference}
            onChange={(event) =>
              dispatch(
                setThemePreference(
                  event.target.value as initialStateTypes["themePreference"],
                ),
              )
            }
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            System follows your device setting. Light and dark stay selected on
            this device.
          </p>
        </section>
      </div>
    </div>
  );
}
