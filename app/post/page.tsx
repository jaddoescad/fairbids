import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import {AddQuote, ClearAllQuotes} from "./actions";

export default async function Page() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: quotes } = await supabase.from('quotes').select()

    return (
        <div>
            <pre>{JSON.stringify(quotes, null, 2)}</pre>

            <div className="pt-4">
                {/* Handle Add quote */}
                <form action={AddQuote} className={'animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground'}>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border"
                        name="quote"
                        type="text"
                        placeholder="Write your title here..."
                    />
                    <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                        Add Quote
                    </button>
                </form>

                {/* Handle Clear All quotes */}
                <form>
                    <button
                        formAction={ClearAllQuotes}
                        className="animate-in w-full bg-red-700 rounded-md px-4 py-2 text-foreground mb-2"
                    >
                        Clear All quotes
                    </button>
                </form>
            </div>
        </div>
    )
}