"use client";

import dynamic from "next/dynamic";
import type { AreaPickerProps } from "./AreaPicker";

export const AreaPickerLoader = dynamic<AreaPickerProps>(() => import("./AreaPicker"), {
  ssr: false,
  loading: () => (
    <div role="status" className="grid h-[360px] place-items-center rounded-md border border-[#d9e2e7] bg-[#f0f4f7] text-sm text-[#5d686c]">
      Loading map...
    </div>
  ),
});
