'use client'

import {createClient} from "@/utils/supabase/client";
import useSWRImmutable from "swr/immutable";

export function getQuotes() {
    const supabase = createClient()

    const getQuotesSWR = async () => {
        const { data } = await supabase
            .from('quotes')
            .select()
        return data
    }

    const { data, isLoading, isValidating } = useSWRImmutable('getQuotes', getQuotesSWR, {});

    return { data, isLoading, isValidating }
}