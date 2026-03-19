"use client"

import Message from "@/app/ui/message";
import FighterList from "@/app/ui/fighter-list";
import { use, Suspense } from "react";

export default function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const {name, ...params} = use(searchParams);
	const request = fetch(`http://localhost:8000/${name}/?` + new URLSearchParams(params))
          .then(res => res.json())
          .catch(err => console.error("Unable to retrieve data:", err));

    return (
        <Suspense fallback={<div>Loading...</div>}>
			<Counterpicks name={name} result={request} />
		</Suspense>
	);
}

function Counterpicks({ name, result }) {
	const res = use(result);

	return (
		<>
			{res.msg ?
			 <Message info={res} />
			 :
			 <FighterList name={name} res={res} />
			}
		</>
	);
}
