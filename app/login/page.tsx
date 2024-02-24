import Link from 'next/link'
import Messages from "./messages";
import {signIn, signUp, signInWithEmail, signInWithGoogle, signInWithGithub, signInWithDiscord} from "./actions";
import {Suspense} from "react";

export default function Login() {
    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>{' '}
                Back
            </Link>
            <Link
                href={"/login/client"}
                className="absolute right-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                Sign in using client{' '}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 rotate-180"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </Link>
            <div>
                <form
                    className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                    action={signIn}
                >
                    <label className="text-md" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                    />
                    <label className="text-md" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                    />
                    <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                        Sign In
                    </button>
                    <button
                        formAction={signUp}
                        className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
                    >
                        Sign Up
                    </button>
                </form>
                <form className='animate-in pt-2'>
                    <div className={'flex items-center w-full space-x-2 text-foreground'}>
                        <button formAction={signInWithGoogle} className="flex-grow w-3/9 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2">
                            Google
                        </button>
                        <button formAction={signInWithGithub} className="flex-grow w-3/9 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2">
                            Github
                        </button>
                        <button formAction={signInWithDiscord} className="flex-grow w-3/9 border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2">
                            Discord
                        </button>
                    </div>
                </form>
                <form action={signInWithEmail}>
                    <div className={'flex items-center w-full animate-in space-x-2 text-foreground'}>
                        <input
                            className="flex-grow rounded-md px-4 py-2 bg-inherit border mb-2"
                            name="email"
                            placeholder="you@example.com"
                            required
                        />
                        <button className=" w-[126.24px] border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2">
                            Magic Link
                        </button>
                    </div>
                </form>
                <Suspense>
                    <Messages/>
                </Suspense>
            </div>
        </div>
    )
}
