"use client"

import Message from "@/app/ui/message";
import FighterList from "@/app/ui/fighter-list";
import { use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Page() {
	return (
		<Suspense fallback={<span>Loading...</span>}>
			<QueryClientProvider client={queryClient}>
				<Counterpicks />
			</QueryClientProvider>
		</Suspense>
	);
}

function Counterpicks() {
	const sp = useSearchParams();
    const name = sp.get("name") ?? "steve";
    const params = {
        "mthr": sp.get("mthr") ?? "-0.5",
        "ctol": sp.get("ctol") ?? "-0.5",
        "weighted": sp.get("weighted") ?? "1",
    };

    const { status, data, error } = useQuery({
        queryKey: ["counterpicks", name, params],
        queryFn: async () => {
            const response = await fetch(`/api/${name}/?` + new URLSearchParams(params));
            if (!response.ok) {
                throw new Error("Unable to retrieve counterpicks from api.");
            }
            return response.json();
        },
    });

    if (status === "pending") {
        return <span>Loading...</span>;
    }

    if (status === "error") {
        return <span>Error: {error.message}</span>
    }

    return (
		<>
            <Link href="/">Go back</Link>
			{data.msg ?
			 <Message info={data} />
			 :
			 <FighterList name={name} res={data} />
			}
		</>
    );
}
