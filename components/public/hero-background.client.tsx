"use client";

import dynamic from "next/dynamic";
import React from "react";

const HeroBackground = dynamic(
  () => import("./hero-background").then((mod) => mod.HeroBackground),
  { ssr: false, loading: () => null }
);

type Props = {
  projectTitles?: string[];
  skills?: string[];
};

export function HeroBackgroundClient({ projectTitles = [], skills = [] }: Props) {
  return <HeroBackground projectTitles={projectTitles} skills={skills} />;
}
