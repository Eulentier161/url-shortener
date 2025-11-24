"use client"

import type { CreateRedirectResponse } from "@/app/api/route"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useState, useTransition } from "react"
import Input from "./Input"

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
    />
  </svg>
)

export default function Form() {
  const [state, setState] = useState<CreateRedirectResponse | null>(null)
  const [pending, startTransition] = useTransition()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const res = await fetch("/api", {
      method: "POST",
      body: JSON.stringify(
        Object.fromEntries(new FormData(event.currentTarget))
      ),
    })
    const data: CreateRedirectResponse = await res.json()
    setState(data)
  }

  return (
    <>
      <div>
        <Dialog
          open={!!(state?.url && state?.slug)}
          onClose={() => setState(null)}
          className="relative z-10"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
              >
                <div>
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-500/10">
                    <CheckIcon
                      aria-hidden="true"
                      className="size-6 text-green-400"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-white"
                    >
                      Request successful
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        You can now visit your shortened URL at{" "}
                        <Link
                          href={`/${state?.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          {state?.url}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!state?.url) return
                      await navigator.share({
                        title: state.slug,
                        text:
                          "A shortened URL created" + window.location.origin,
                        url: state.url,
                      })
                    }}
                    className="cursor-pointer gap-1 disabled:cursor-default inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:col-start-2"
                  >
                    <span>Share</span>
                    <ShareIcon />
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    className="cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20 sm:col-start-1 sm:mt-0"
                    onClick={() => setState(null)}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>

      <form
        className="grid grid-cols-1"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          startTransition(async () => {
            await onSubmit(e)
          })
        }}
      >
        <Input
          label="Slug"
          id="slug"
          name="slug"
          type="text"
          placeholder="github"
          required
          disabled={pending}
          errors={state?.properties?.slug?.errors}
          onChange={() => setState(null)}
        />
        <Input
          label="URL"
          id="url"
          name="url"
          type="url"
          placeholder="https://github.com/Eulentier161/url-shortener"
          required
          disabled={pending}
          errors={state?.properties?.url?.errors}
          onChange={() => setState(null)}
        />
        <button
          id="submit-btn"
          disabled={pending || state?.type === "error"}
          className="cursor-pointer disabled:cursor-default rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          type="submit"
        >
          {["Submit", "Submitting..."][Number(pending)]}
        </button>
      </form>
    </>
  )
}
