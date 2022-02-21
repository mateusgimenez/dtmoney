import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { api } from "../services/api";

interface Transactions {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

//  interface TransactionsInput {
//     title: string;
//     amount: number;
//     type: string;
//     category: string;
//  }

// type TransactionsInput = Pick< Transactions, 'title' | 'amount' | 'type' | 'category' >

type TransactionsInput = Omit< Transactions, 'id' | 'createdAt' >;

interface TransactionsProviderProps {
    children: ReactNode
}

interface TransactionsContextData {
    transactions: Transactions[];
    createTransaction: ( transactions: TransactionsInput ) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transactions[]>([]);

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    }, []) 

    async function createTransaction(transactionsInput: TransactionsInput) {    
        const response = await api.post('/transactions', {
            ...transactionsInput,
            createdAt: new Date(),
        })
        const {  transaction } = response.data;
        
        setTransactions([
            ...transactions,
            transaction
        ]);
    }

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
              {children}
        </TransactionsContext.Provider>
    )
}



export function useTransactions() {
    const context = useContext(TransactionsContext);

    return context;
}