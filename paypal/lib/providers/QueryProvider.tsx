import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactNode } from 'react';
  
// Create a client
const queryClient = new QueryClient()

function QueryProvider({children}: {children: ReactNode}) {
    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
    )
}

export default QueryProvider;