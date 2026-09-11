/* THIS FILE IS THE PAYLOAD ADMIN ROOT LAYOUT — do not add site markup here.
   Generated per the official Payload 3 Next template. */
import type { ServerFunctionClient } from "payload";
import type { Metadata } from "next";
import config from "@payload-config";
import "@payloadcms/next/css";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import React from "react";
import { importMap } from "./admin/importMap.js";

type Args = { children: React.ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export const metadata: Metadata = { robots: { index: false, follow: false } };

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
