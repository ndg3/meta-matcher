"use client";

import { characters } from "@/lib/characters";
import { useState } from "react";

export default function Home() {
  return (
    <>
      <h1>Welcome to Meta Matcher!</h1>
      <CounterpickForm />
      <h2>About</h2>
      <p>
        In competitive <i>Super Smash Bros. Ultimate</i>, there are some
        matchups that are too difficult for your main. You may want to pick up
        another character for certain poor matchups, either to go further in
        bracket or just to try something different. Meta Matcher is a web app
        that helps you find the best counterpick for your main.
      </p>
      <p>
        To use the app, first pick a character in the drop down. Then, set the
        following parameters:
      </p>
      <ul>
        <li>
          Matchup threshold: How poorly the character performs against another
          for it to be considered a bad matchup. Default is -0.5.
        </li>
        <li>
          Counterpick tolerance: Allow the counterpick character to perform this
          much worse for some matchups. Don&apos;t worry, every counterpick will
          be an improvement in some way. Default is -0.5.
        </li>
        <li>
          Use weighted average?: Prefer counterpicks that perform better against
          the worst matchups. Default is Yes.
        </li>
      </ul>
      <p>
        Once everything is set, click on the &quot;Submit&quot; button. You will
        be sent to a page that lists every counterpick and how well it does with
        your character&apos;s bad matchups. To try again with different values,
        navigate back to the main page.
      </p>
      <h2>Troubleshooting</h2>
      <p>
        You may see an error message instead of a list of counterpicks. Here is
        what to do if you get any of these:
      </p>
      <ul>
        <li>
          <code>&apos;msg: invalid name&apos;</code> or{" "}
          <code>&apos;msg: mthr out of range&apos;</code> or{" "}
          <code>&apos;msg: ctol out of range&apos;</code>: Incorrect values were
          provided for the character name, matchup threshold, or counterpick
          tolerance, respectively. This can happen if you put the parameters in
          the URL instead of using the form. Enter different values and try
          again, or use the main page instead.
        </li>
        <li>
          <code>&apos;msg: no bad matchups&apos;</code>: No bad matchups could
          be found because the matchup threshold was too strict. Try going back
          to the main page and lowering this parameter.
        </li>
        <li>
          <code>&apos;msg: no suitable counterpicks&apos;</code>: No
          counterpicks could be found because the counterpick tolerance was too
          strict. Try going back to the main page and lowering this parameter.
        </li>
      </ul>
      <p>
        Also, you may see warning messages at the bottom of the page. This
        happens when the values in the URL could not be parsed, so the default
        values were used instead. Try different values in the URL, or use the
        main page instead.
      </p>
    </>
  );
}

function CounterpickForm() {
  const [mthrLabel, setMthrLabel] = useState("-0.5");
  const [ctolLabel, setCtolLabel] = useState("-0.5");
  return (
    <form action={`/counterpick`} method="get">
      <div>
        <label htmlFor="name">Fighter</label>
        <select name="name" id="name" required>
          <option key="default" value="">
            Choose a fighter
          </option>
          {Object.entries(characters).map(([apiName, name]) => (
            <option key={apiName} value={apiName}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="mthr">Matchup threshold</label>
        <input
          type="range"
          name="mthr"
          min="-3.0"
          max="-0.1"
          step="0.1"
          defaultValue={mthrLabel}
          onChange={(e) => setMthrLabel(e.target.value)}
        />
        <output name="mthrResult" htmlFor="mthr">
          {(+mthrLabel).toFixed(1)}
        </output>
      </div>
      <div>
        <label htmlFor="ctol">Counterpick tolerance</label>
        <input
          type="range"
          name="ctol"
          min="-1.0"
          max="-0.1"
          step="0.1"
          defaultValue={ctolLabel}
          onChange={(e) => setCtolLabel(e.target.value)}
        />
        <output name="ctolResult" htmlFor="ctol">
          {(+ctolLabel).toFixed(1)}
        </output>
      </div>
      <div>
        <label htmlFor="weighted">Use weighted average?</label>
        <input
          type="radio"
          id="useW"
          name="weighted"
          value="1"
          defaultChecked
        />
        <label htmlFor="useW">Yes</label>
        <input type="radio" id="noW" name="weighted" value="0" />
        <label htmlFor="noW">No</label>
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
}
