"use client";

export default function Message({
  info,
}: {
  info: { [key: string]: number | string | boolean };
}) {
  return (
    <ul>
      {Object.entries(info)
        .slice(0, -1)
        .map(([k, v]) => (
          <li key={k}>
            {k}: {"" + v}
          </li>
        ))}
    </ul>
  );
}
