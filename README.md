# Bjorn RGB Control Tool

**This tool is meant to be used with a device running [bjorn-rgb](https://github.com/ch5zzy/bjorn-rgb).**

This web tool allows a user to configure the brightness, dimming, and image settings
for a Raspberry Pi running [bjorn-rgb](https://github.com/ch5zzy/bjorn-rgb). Additionally,
it provides GIF searching via Tenor and GIPHY for ease of selecting images to display.

## Running

Configure the provided `.env` file with all necessary API keys and IDs, including
- A [jsonblob](https://jsonblob.com/) ID for storing the configuration.
- An [imgbb](https://api.imgbb.com/) API key for storing images.
- A [Tenor](https://developers.google.com/tenor/guides/quickstart) API key for.
searching for GIFs on Tenor.
- A [GIPHY](https://developers.giphy.com/docs/api/) API key for searching for GIFs
on GIPHY.
- An admin password to allow a user to customize the displayed image.

Then, run `npm run dev` to run the configuration tool. To access the admin interface,
append `?pwd=` followed by your configured password to the end of the URL where
the tool is hosted.
