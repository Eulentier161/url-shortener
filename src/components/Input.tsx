"use client";

import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { type ComponentPropsWithoutRef, type JSX, useState } from "react";

export default function Example(
  props: Omit<ComponentPropsWithoutRef<"input">, "className"> & {
    label: string;
    errors?: string[];
    icon?: JSX.Element;
  },
) {
  const [slug, setSlug] = useState<string>("");

  return (
    <div className="w-full">
      <label
        htmlFor={props.id}
        className="block text-sm/6 font-medium text-gray-900 dark:text-white"
      >
        {props.label}
      </label>
      <div className="mt-2 grid grid-cols-1">
        <div className={clsx("flex", props.icon && "gap-2")}>
          <input
            {...props}
            value={slug}
            onChange={(e) => void setSlug(e.target.value)}
            className={clsx(
              "col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-10 pl-3  outline-1 -outline-offset-1  focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6 dark:bg-white/5",
              props.errors
                ? "text-red-900 outline-red-300 placeholder:text-red-300 focus:outline-red-600 dark:text-red-400 dark:outline-red-500/50 dark:placeholder:text-red-400/70 dark:focus:outline-red-400"
                : "outline-indigo-300 focus:outline-indigo-600 dark:outline-indigo-500/50 dark:focus:outline-indigo-400",
            )}
          />
          {props.icon && <div onClick={() => void setSlug(nanoid())}>{props.icon}</div>}
        </div>
        {props.errors && (
          <ExclamationCircleIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4 dark:text-red-400"
          />
        )}
      </div>
      <p
        id={`${props.id}-error`}
        className="mt-2 text-sm text-red-600 dark:text-red-400"
      >
        {props.errors?.join(", ")}
      </p>
    </div>
  );
}
