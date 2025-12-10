# rt-templater
This is a project to extract reminder text from scryfall cards and generate card magician templates for it.

## usage

1. Install NodeJS.
2. Download a scryfall oracle-cards data dump from the [bulk data API page](https://scryfall.com/docs/api/bulk-data).
3. Put the file into the input folder, and configure the `CARDS_FILENAME` in index.js to be the filename of your file.
4. Run `npm start`
5. Output will be produced in the output directory.
