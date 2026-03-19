"use client";

import { characters } from '@/lib/characters';
import { useState } from 'react';

export default function Home() {
    return ( <CounterpickForm/> );
}

function CounterpickForm({ name }) {
	const [mthrLabel, setMthrLabel] = useState(-0.5);
	const [ctolLabel, setCtolLabel] = useState(-0.5);
    return (
        <form action={`/counterpick`} method="get">
			<div>
				<label htmlFor="name">Fighter</label>
				<select name="name" id="name" required>
					<option key="default" value="">Choose a fighter</option>
					{Object.entries(characters).map(([apiName, name]) =>
						<option key={apiName} value={apiName}>{name}</option>
					)}
				</select>
			</div>
            <div>
				<label htmlFor="mthr">Matchup threshold</label>
				<input type="range" name="mthr" min="-3.0" max="-0.1" step="0.1" defaultValue={mthrLabel} onChange={(e) => setMthrLabel(e.target.value)}/>
				<output name="mthrResult" htmlFor="mthr">{(+mthrLabel).toFixed(1)}</output>
            </div>
            <div>
				<label htmlFor="ctol">Counterpick tolerance</label>
				<input type="range" name="ctol" min="-1.0" max="-0.1" step="0.1" defaultValue={ctolLabel} onChange={(e) => setCtolLabel(e.target.value)}/>
				<output name="ctolResult" htmlFor="ctol">{(+ctolLabel).toFixed(1)}</output>
            </div>
            <div>
				<label htmlFor="weighted">Use weighted average?</label>
				<input type="radio" id="useW" name="weighted" value="1" defaultChecked />
				<label htmlFor="useW">Yes</label>
				<input type="radio" id="noW" name="weighted" value="0" />
				<label htmlFor="noW">No</label>
            </div>
            <div>
				<input type="submit" value="Submit" />
            </div>
        </form>
    )
}
