'use client'

import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {createClient} from "@/utils/supabase/client";

interface QuotesFormClientProps {
    refresh: boolean;
    setRefresh: Dispatch<SetStateAction<boolean>>;
}

export function QuotesFormClient({ refresh, setRefresh }: QuotesFormClientProps) {
    const [title, setTitle] = useState("");
    const supabase = createClient()

    

    const handleAddQuote = async (e: FormEvent) => {
        e.preventDefault();
        if (title.trim() === "") return;

        const { error } = await supabase
            .from('quotes')
            .insert([{ title }])

        if (!error) {
            setTitle("")
            setRefresh(!refresh)
        }
    }

    const handleClearAllQuotes = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const { error } = await supabase
            .from('quotes')
            .delete()
            .eq('user_id', session?.user?.id)

        if (!error) {
            setRefresh(!refresh)
        }
    }

    return (
        <div className="pt-4">
            <form onSubmit={handleAddQuote} className={'animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground'}>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border"
                    name="quote"
                    type="text"
                    placeholder="Write your quote here..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                    Add Quote
                </button>
            </form>

            <button
                onClick={handleClearAllQuotes}
                className="animate-in w-full bg-red-700 rounded-md px-4 py-2 text-foreground mb-2"
            >
                Clear All quotes
            </button>
        </div>
    )
}