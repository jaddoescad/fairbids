'use client'

import {getQuotes} from "./getQuotes";
import {mutate} from "swr";
import { QuotesFormSWR } from "./QuotesFormSWR";

export default function QuotesClient() {
    const {data: quotes, isLoading: isLoadingQuotes, isValidating: isValidatingQuotes} = getQuotes()

    return (
        <div>
            {isLoadingQuotes ? (
                    <pre>Loading...</pre>
                ) : isValidatingQuotes ? (
                    <>
                    <pre>{JSON.stringify(quotes, null, 2)}</pre>
                    <pre>Validating...</pre>
                    </>
                ) : (
                    <pre>{JSON.stringify(quotes, null, 2)}</pre>
                )
            }
            <button className={'border rounded-md px-2 w-24 hover:bg-gray-900'} onClick={() => mutate('getQuotes')}>Mutate</button>

            <QuotesFormSWR/>
        </div>
    )
}