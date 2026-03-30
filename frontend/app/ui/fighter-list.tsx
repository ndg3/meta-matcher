"use client";

import { characters, getNameFromApi } from "@/lib/characters";

export default function FighterList({
  name,
  res,
}: {
  name: string;
  res: { [key: string]: { [key: string]: number | string } };
}) {
  return (
    <>
      <h1>Matches for {parseName(name)}</h1>
      <ul>
        {Object.entries(res)
          .slice(0, -2)
          .map(([fighter, counterpicks], idx) => {
            return (
              <div key={`div:${idx}`}>
                <li key={fighter}>{getNameFromApi(fighter)}</li>
                <ul>
                  {Object.entries(counterpicks).map(([n, v]) => (
                    <li key={`${fighter}:${n}`}>
                      {parseName(n)}: {(+v).toFixed(1)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        <li key={`name:${name}`}>For comparison: {getNameFromApi(name)}</li>
        <ul>
          {Object.entries(res[name]).map(([n, v]) => (
            <li key={`${name}:${n}`}>
              {parseName(n)}: {(+v).toFixed(1)}
            </li>
          ))}
        </ul>
        {Object.keys(res.warnings).length !== 0 ? (
          <>
            <li key="warnings">Warnings</li>
            <ul>
              {Object.entries(res.warnings).map(([n, v]) => (
                <li key={`warning:${n}`}>{v}</li>
              ))}
            </ul>
          </>
        ) : (
          <></>
        )}
      </ul>
    </>
  );
}

const parseName = (name: string) =>
  name in characters ? getNameFromApi(name) : name;
