import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export function AuthLayout({ children, title, subtitle, bottomText, bottomLinkText, bottomLinkTo }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="bg-white p-8 shadow-sm ring-1 ring-zinc-200 sm:rounded-xl dark:bg-zinc-900 dark:ring-zinc-800">
          {children}
        </div>

        {bottomText && bottomLinkText && bottomLinkTo && (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {bottomText}{" "}
            <Link
              to={bottomLinkTo}
              className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              {bottomLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
