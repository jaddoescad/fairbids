'use client'

import { createClient } from '@/utils/supabase/client'
import {useEffect, useState} from 'react'
import { JobFormClient } from "./JobFormClient";

export default function Page() {
    const [refresh, setRefresh] = useState(false)

    // useEffect(() => {
    //     const getData = async () => {
    //         const { data } = await supabase.from('quotes').select()
    //         setQuotes(data)
    //     }
    //     getData()
    // }, [refresh])

    return (

            <div
              className="
              max-w-4xl
              w-full
        
            "
            >
            {/* <pre>{JSON.stringify(quotes, null, 2)}</pre> */}
            <h2 className="text-2xl font-bold text-center mb-4">Create New Job</h2>

            <JobFormClient refresh={refresh} setRefresh={setRefresh}/>
        </div>
    )
}