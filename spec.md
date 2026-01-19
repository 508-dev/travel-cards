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

At the very bottom 
