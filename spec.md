# Travel Cards

This is a webapp that allows users to go through a series of form inputs to generate a card they can print out that indicates helpful information in a local language. For example, the card will show their allergies or dietary requirements.

The UI is simple and clean, text-focused. The first scene when the user opens it is two inputs: "I speak..." and "I'm traveling somewhere that speaks...", and both are language picker dropdowns. For now, the "I speak..." dropdown only has English, while the other dropdown has Spanish, Mandarin Chinese (Traditional), Mandarin Chinese (simplified). 

Upon selecting both languages, a form of checkboxes is displayed under the dropdowns. It is labeled "I need to communicate," and the options are: 

* Food allergies
* FOod restrictions
* Medicine allergies
* Medical conditions
* Phobias

Depending on what checkboxes are checked, certain autocomplete dropdowns will display, allowing the user to choose e.g. their allergies, phobias, etc. 

Upon selection, the given item will be removed as a dropdown option, and displayed below the given form. 

The autocomplete dropdowns each get their own row on the page, and their selected options gets a row below them, filling up space and overruning to the next row if so.

At the very bottom will persist a "generate card" button. This redirects to a view that renders the selected options as a card. Uniquely, this view is rendered based on query params in the URL, so the user can bookmark this exact card and re-render it on another machine if needbe. This means that all state of the selected forms can be translated to query params. 

The Card view is a simple UI that shows a business card with the previously selected information in the foreign language. If there's too much information to show on the card in a reasonable font size, then two cards will be shown, and so on. There is a button outside of the cards that says "Print." If the user clicks this, a print dialog will open that allows printing or saving to PDF the Card view as one or more pages depending on how many cards are needed to contain the information. The printed card view should not show any app UI such as buttons, there should be some native CSS or HTML way to make some elements hidden in a print view. 

In the Card view is also a button for returning back to the cardmaking view. 

## Technical Considerations

* The app is a Svelte/typescript SPA with minimal other requirements
* The app is bundled using bun
* The app packages are managed by bun
* Standard CSS is used for styling, with no libraries
* Deployment should require simply serving a static bundle of assets 
* Data such as lists of allergies or food restrictions are stored as JSON files
* Data is mapped via ID, so that if e.g. a language picker is changed and nothing else, when the Card view renders, it access translations using the same IDs as before.
  * E.g. `allergies[3]` would always refer to "peanuts" in a given language
* As such, data encoded into query params when rendering the Card view will also refer to ids. E.g. `?allergies=3&allergies=2`
* Each language gets its own JSON file for mappings
* English is the source of truth. The english language file contains the master mappings such that "peanuts" can be retrieved to return "3" in some way. 
* The data that populates the dropdowns is supplied via JSON
* Types are enforced via typescript; of course typescript can't enforce JSON, but a type is nonetheless supplied that describes the JSON file shapes


## LLM Considerations

* Any LLM working on this app will record decisions it makes in the `decisions.md` file. If that decision overrides or modifies a different decision in that file, it will strike out that previous decision and append the new, or modified, decision. 
* If the decision file is empty, the LLM will record in there the basic structure of the app, basically technical specifications
* Recorded decisions should, very briefly, explain reasonings or justifications. These can be as simple as "the lead engineer said so", such as the decision to use Svelte. 
* When in doubt, ask first
