# Majestic wines + Vivino Chrome extension

Chrome extension to display Vivino wine score on Majestic wines, to aid in purchasing decisions. 

While this extension is under review, you may clone this repository and select 'Load unpacked' under 'chrome://extensions' to use this extension.

This extension works with [Majestic wines](https://www.majestic.co.uk) and [Vivino](https://www.vivino.com), requiring host permissions to access both websites. To use, simply use the [Majestic wines](https://www.majestic.co.uk) search engine and after a few seconds the wines and their ratings, price and region will be displayed in a table on the bottom right of the screen. [Example screenshot](https://github.com/chrisahart/vivino-majestic/blob/main/extension/screenshot.png). I recommend a maximum 'View per page' of 24, as Vivino will temporarily block your IP address if you submitted too many requests.

Some basic analysis can be found under in the [analysis folder](https://github.com/chrisahart/vivino-majestic/tree/main/analysis). Data was downloaded from [Majestic wines](https://www.majestic.co.uk), limited to currently in stock red wines only. Half bottles, port and wines with a price over £100 were removed from the dataset. The Vivino rating and Majestic Wines price is [plotted for all countries](https://github.com/chrisahart/vivino-majestic/blob/main/analysis/plots/price_rating_all.png), and also for [all wine regions within each country](https://github.com/chrisahart/vivino-majestic/blob/main/analysis/plots/price_rating_france-multiple-regions-only.png). A [.csv file](https://github.com/chrisahart/vivino-majestic/blob/main/analysis/data/wines_rating-above-4.0_price-below-20.csv) is included containing wines with a Vivino rating above 4.0 and a price below £20, representing the greatest value.
![image](https://github.com/chrisahart/vivino-majestic/assets/10100029/56abaed0-5835-455f-b89d-d67fd9c08925)
