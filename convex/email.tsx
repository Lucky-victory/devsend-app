import "./polyfills";
import VerifyEmail from "./emails/verifyEmail";
import MagicLinkEmail from "./emails/magicLink";
import VerifyOTP from "./emails/verifyOTP";
import { render } from "@react-email/components";
import React from "react";
import ResetPasswordEmail from "./emails/resetPassword";
import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { type RunMutationCtx } from "@convex-dev/better-auth";

const apiKey = process.env.RESEND_API_KEY;
export const resend: Resend = new Resend(components.resend, {
  testMode: false,
  apiKey,
});

export const sendEmailVerification = async (
  ctx: RunMutationCtx,
  {
    to,
    url,
    token,
  }: {
    to: string;
    url: string;
    token: string;
  }
) => {
  await resend.sendEmail(ctx, {
    from: "DevSend <victory@notif.klozbuy.com>",
    to,
    subject: "Verify your email address",
    html: await render(<VerifyEmail url={`${url}?token=${token}`} />),
  });
};

export const sendOTPVerification = async (
  ctx: RunMutationCtx,
  {
    to,
    code,
  }: {
    to: string;
    code: string;
  }
) => {
  await resend.sendEmail(ctx, {
    from: "DevSend <victory@notif.klozbuy.com>",
    to,
    subject: "Verify your email address",
    html: await render(<VerifyOTP code={code} />),
  });
};

export const sendMagicLink = async (
  ctx: RunMutationCtx,
  {
    to,
    url,
    token,
  }: {
    to: string;
    url: string;
    token: string;
  }
) => {
  await resend.sendEmail(ctx, {
    from: "DevSend <victory@notif.klozbuy.com>",
    to,
    subject: "Sign in to your account",
    html: await render(<MagicLinkEmail url={`${url}?token=${token}`} />),
  });
};

export const sendResetPassword = async (
  ctx: RunMutationCtx,
  {
    to,
    url,
  }: {
    to: string;
    url: string;
  }
) => {
  await resend.sendEmail(ctx, {
    from: "DevSend <victory@notif.klozbuy.com>",
    to,
    subject: "Reset your password",
    html: await render(<ResetPasswordEmail url={url} />),
  });
};
