'use client'

import { createClient } from '@/utils/supabase/client'
import {useEffect, useState} from 'react'
import { QuotesFormClient } from "./QuotesFormClient";

export default function Page() {
    const [quotes, setQuotes] = useState<any[] | null>(null)
    const [refresh, setRefresh] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase.from('quotes').select()
            setQuotes(data)
        }
        getData()
    }, [refresh])

    return (
        <div>
            <pre>{JSON.stringify(quotes, null, 2)}</pre>

            <QuotesFormClient refresh={refresh} setRefresh={setRefresh}/>
        </div>
    )
}