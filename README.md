# Majestic wines + Vivino Chrome extension

Chrome extension to display Vivino wine score on Majestic wines, to aid in purchasing decisions. 

While this extension is under review, you may clone this repository and select 'Load unpacked' under 'chrome://extensions' to use this extension.

This extension works with [Majestic wines](https://www.majestic.co.uk) and [Vivino](https://www.vivino.com), requiring host permissions to access both websites.

Some basic analysis can be found under in the [analysis folder](https://github.com/chrisahart/vivino-majestic/tree/main/analysis). Data was downloaded from [Majestic wines](https://www.majestic.co.uk), limited to currently in stock red wines only. Half bottles, port and wines with a price over £100 were removed from the dataset. The Vivino rating and Majestic Wines price is [plotted for all countries](https://github.com/chrisahart/vivino-majestic/blob/main/analysis/plots/price_rating_all.png), and also for [all wine regions within each country](https://github.com/chrisahart/vivino-majestic/blob/main/analysis/plots/price_rating_france-multiple-regions-only.png). A [.csv file](https://github.com/chrisahart/vivino-majestic/blob/main/analysis/data/wines_rating-above-4.0_price-below-20.csv) is included containing wines with a Vivino rating above 4.0 and a price below £20, representing the greatest value.
