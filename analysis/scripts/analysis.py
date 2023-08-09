import numpy as np
from matplotlib import pyplot as plt
import pandas
from scipy.optimize import curve_fit
from matplotlib.lines import Line2D
from html import escape, unescape


def func_plot_all(func_fig, func_ax, func_data_1, func_data_2, func_markers, func_colors,
                  func_xlim=None, func_ylim=None, legend=False):
    for counter in range(len(func_data_1)):
        func_ax.plot(func_data_1[counter]['Price'], func_data_1[counter]['Rating'], linestyle='None',
                     marker=func_markers[counter], color=func_colors[counter], label=func_data_2[counter])
    func_ax.set_xlabel('Price / £')
    func_ax.set_ylabel('Vivino rating')
    func_ax.legend(frameon=True)
    if func_xlim:
        func_ax.set_xlim([func_xlim[0], func_xlim[1]])
    if func_ylim:
        func_ax.set_ylim([func_ylim[0], func_ylim[1]])
    if legend:
        func_ax.legend(frameon=True)
    func_fig.tight_layout()
    return func_fig, func_ax


def func_plot_country_region(func_fig, func_ax, func_data_1, func_markers, func_colors,
                             func_xlim=None, func_ylim=None, legend=False, legend_size=None, plot_singles=True):

    # Calculate indices of regions
    indexes = ([func_data_1['Region'].to_list().index(x) for x in sorted(set(func_data_1['Region'].to_list()))])
    print('\nNumber of wines: ', func_data_1.shape[0], 'Number of unique regions: ', len(indexes))

    # Plot line for each region in country
    for counter in range(len(indexes)):
        if counter == len(indexes) - 1 and indexes[counter] == func_data_1.shape[0] - 1:  # End of array single valued
            if plot_singles:
                func_ax.plot(func_data_1.at[indexes[counter], 'Price'],
                             func_data_1.at[indexes[counter], 'Rating'], linestyle='None',
                             marker=func_markers[counter], fillstyle='none', color=func_colors(counter / len(indexes)),
                             label=unescape(func_data_1.at[indexes[counter], 'Region']))
        elif counter == len(indexes) - 1:  # End of array multi-valued
            dataframe_extracted = func_data_1.loc[indexes[counter]:]
            dataframe_extracted_sorted = dataframe_extracted.sort_values('Price')
            dataframe_extracted_sorted = dataframe_extracted_sorted.reset_index(drop=True)
            func_ax.plot(dataframe_extracted_sorted['Price'], dataframe_extracted_sorted['Rating'],
                         marker=func_markers[counter], fillstyle='none', color=func_colors(counter / len(indexes)),
                         label=unescape(func_data_1.at[indexes[counter], 'Region']))
        elif indexes[counter + 1] == indexes[counter] + 1:  # Single valued region
            if plot_singles:
                func_ax.plot(func_data_1.at[indexes[counter], 'Price'],
                             func_data_1.at[indexes[counter], 'Rating'], linestyle='None',
                             marker=func_markers[counter], fillstyle='none', color=func_colors(counter / len(indexes)),
                             label=unescape(func_data_1.at[indexes[counter], 'Region']))
        else:  # Multi-valued region sorted by price
            dataframe_extracted = func_data_1.loc[indexes[counter]: indexes[counter + 1] - 1]
            dataframe_extracted_sorted = dataframe_extracted.sort_values('Price')
            dataframe_extracted_sorted = dataframe_extracted_sorted.reset_index(drop=True)
            func_ax.plot(dataframe_extracted_sorted['Price'], dataframe_extracted_sorted['Rating'],
                         marker=func_markers[counter], fillstyle='none', color=func_colors(counter / len(indexes)),
                         label=unescape(func_data_1.at[indexes[counter], 'Region']))
    func_ax.set_xlabel('Price / £')
    func_ax.set_ylabel('Vivino rating')
    if func_xlim:
        func_ax.set_xlim([func_xlim[0], func_xlim[1]])
    if func_ylim:
        func_ax.set_ylim([func_ylim[0], func_ylim[1]])
    if legend:
        if legend_size:
            func_ax.legend(frameon=True, prop={'size': legend_size})
        else:
            func_ax.legend(frameon=True)
    return func_fig, func_ax


# Plotting definitions
params = {'axes.formatter.limits': [-4, 4],
          'axes.labelsize': 'large',
          'axes.titlesize': 'large',
          'lines.markersize': '8',
          }
plt.rcParams.update(params)
cm = plt.get_cmap('hsv')
markers = list(Line2D.markers.keys())[2:30]
markers = [e for e in markers if e not in ('|', '_',  0, 1, 2, 3, 4, '1', '2', '3', '4', '8')] * 5
plotting_colors = ['r', 'g', 'b', 'm', 'grey', 'orange', 'y', 'brown', 'cyan', 'pink']
plotting_markers = ['x', 'o', 'v', '^', '<', '>', 's', 'p', '*', 'h']
dpi = 300
fig_size = [12, 10]

# Import data
folder = '/Volumes/ELEMENTS/Storage/Personal/Git/vivino-majestic/analysis'
cols = ['Product Name', 'Rating', 'Price', 'Region']
data_italy = pandas.read_csv('{}/data/italy.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_spanish = pandas.read_csv('{}/data/spanish.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_french = pandas.read_csv('{}/data/french.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_new_zealand = pandas.read_csv('{}/data/new-zealand.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_american = pandas.read_csv('{}/data/american.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_australian = pandas.read_csv('{}/data/australian.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_english = pandas.read_csv('{}/data/english.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_portuguese = pandas.read_csv('{}/data/portuguese.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_argentinian = pandas.read_csv('{}/data/argentinian.csv'.format(folder), names=cols, sep='\t', skiprows=2).fillna(np.NaN)
data_chilean = pandas.read_csv('{}/data/chilean.csv'.format(folder), sep='\t', names=cols, skiprows=2).fillna(np.NaN)

# Clean data
country = ['Italy', 'Spain', 'French', 'New Zealand', 'USA', 'Australia', 'England', 'Portugal', 'Argentina', 'Chile']
data_all = [data_italy, data_spanish, data_french, data_new_zealand, data_american, data_australian, data_english,
            data_portuguese, data_argentinian, data_chilean]
delete_wines = ['Domaine Paul Mas Ct Mas 2021 Languedoc Rouge',
                'Marqus de Riscal Rioja Reserva 201718 Half Bottle',
                'The Gathering Storm Red 2022 Spain',
                'La Rioja Alta 904 Rioja Gran Reserva 2011 Magnum',
                'Domaines Barons de Rothschild Lafite Rserve Spciale 2019 Mdoc',
                'Penfolds Father Grand Tawny Australia',
                'Taylors LBV Port Decanter 201718 50cl',
                'Porta 6 Reserva 201920 Portugal',
                'Inglenook Rubicon 2013 Rutherford',
                'Porta 6 Red 6 Bottle Wine Case']
for i in range(len(data_all)):
    for j in range(len(delete_wines)):
        data_all[i] = data_all[i][data_all[i]['Product Name'] != delete_wines[j]]
    data_all[i]['Region'] = data_all[i]['Region'].str.replace('Amarone della Valpolicella Classico',
                                                              'Amarone della Valpolicella')
    data_all[i]['Region'] = data_all[i]['Region'].str.replace('Valpolicella Ripasso Classico',
                                                              'Valpolicella Ripasso')
    data_all[i]['Region'] = data_all[i]['Region'].str.replace('Rioja Alta',
                                                              'Rioja')
    data_all[i] = data_all[i][data_all[i]['Rating'].notna()]
    data_all[i] = data_all[i].reset_index(drop=True)

# Save wines with rating_above and price_below
rating_above = 3.8
price_below = 20
cols = ['Product Name', 'Rating', 'Price', 'Region', 'Country']
wines_selected = pandas.DataFrame(columns=cols)
counter_total = 0
for i in range(len(data_all)):
    print('\n {} {} wines total'.format(country[i], data_all[i].shape[0]))
    counter_country = 0
    for j in range(data_all[i].shape[0]):
        if data_all[i].at[j, 'Price'] <= price_below and data_all[i].at[j, 'Rating'] >= rating_above:
            wines_selected.loc[counter_total] = (data_all[i].at[j, 'Product Name'], data_all[i].at[j, 'Rating'],
                                                 data_all[i].at[j, 'Price'],
                                                 unescape(data_all[i].at[j, 'Region']), country[i])
            counter_total = counter_total + 1
            counter_country = counter_country + 1
            print('{} {}, {}, £{}, {}'.format(country[i], counter_country, data_all[i].at[j, 'Product Name'],
                                              data_all[i].at[j, 'Price'], data_all[i].at[j, 'Rating']))
wines_selected.to_csv('{}/data/wines_rating-above-{}_price-below-{}.csv'.format(folder, rating_above, price_below),
                      index=False, sep='\t')

# Plot price against rating for all countries (no zoom)
fig_plot_all_1, ax_plot_all_1 = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_all_1, ax_plot_all_1 = \
    func_plot_all(fig_plot_all_1, ax_plot_all_1, data_all, country, plotting_markers, plotting_colors, legend=True)
fig_plot_all_1.savefig('{}/plots/price_rating_all.png'.format(folder), dpi=dpi)

# Plot price against rating for all countries (zoom)
fig_plot_all_2, ax_plot_all_2 = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_all_2, ax_plot_all_2 = \
    func_plot_all(fig_plot_all_2, ax_plot_all_2, data_all, country, plotting_markers, plotting_colors,
                  [6, 20.5], [3.98, 4.22], legend=True)
fig_plot_all_2.savefig('{}/plots/price_rating_all_zoom.png'.format(folder), dpi=dpi)

# Plot all wine regions for Italy
plot_country = 0
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_italy, ax_plot_italy = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_italy, ax_plot_italy = \
    func_plot_country_region(fig_plot_italy, ax_plot_italy, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_italy.tight_layout()
fig_plot_italy.savefig('{}/plots/price_rating_italy.png'.format(folder), dpi=dpi)
# fig_plot_italy.savefig('{}/plots/price_rating_italy-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for Spain
plot_country = 1
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_spain, ax_plot_spain = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_spain, ax_plot_spain = \
    func_plot_country_region(fig_plot_spain, ax_plot_spain, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_spain.tight_layout()
fig_plot_spain.savefig('{}/plots/price_rating_spain.png'.format(folder), dpi=dpi)
# fig_plot_spain.savefig('{}/plots/price_rating_spain-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for France
plot_country = 2
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)

# Keep only above 4.0 and below £20, or wine regions with multiple values
regions_to_keep = ['Beaujolais', 'Vin de France', 'Côtes-du-Rhône', 'Bordeaux', 'Saint-Émilion Grand Cru', 'Montagne-Saint-Émilion',
                   'Côtes du Roussillon Villages', 'Bordeaux Supérieur', 'La Clape', 'Morgon', 'Pays d&#39;Oc']
data_country_regions = data_country_regions.query("Region in @regions_to_keep")
data_country_regions = data_country_regions.reset_index(drop=True)

fig_plot_france, ax_plot_france = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_france, ax_plot_france = \
    func_plot_country_region(fig_plot_france, ax_plot_france, data_country_regions, markers, cm, func_xlim=[6, 21], legend=True)
# fig_plot_france, ax_plot_france = \
#     func_plot_country_region(fig_plot_france, ax_plot_france, data_country_regions, markers, cm, legend=True, legend_size=5.8)
# fig_plot_france, ax_plot_france = \
#     func_plot_country_region(fig_plot_france, ax_plot_france, data_country_regions, markers, cm, legend=True, plot_singles=False)
fig_plot_france.tight_layout()
fig_plot_france.savefig('{}/plots/price_rating_france_minimal.png'.format(folder), dpi=dpi)
# fig_plot_france.savefig('{}/plots/price_rating_france.png'.format(folder), dpi=dpi)
# fig_plot_france.savefig('{}/plots/price_rating_france-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for New Zealand
plot_country = 3
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_new_zealand, ax_plot_new_zealand = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_new_zealand, ax_plot_new_zealand = \
    func_plot_country_region(fig_plot_new_zealand, ax_plot_new_zealand, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_new_zealand.tight_layout()
fig_plot_new_zealand.savefig('{}/plots/price_rating_new_zealand.png'.format(folder), dpi=dpi)
# fig_plot_new_zealand.savefig('{}/plots/price_rating_new_zealand-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for USA
plot_country = 4
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_american, ax_plot_american = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_american, ax_plot_american = \
    func_plot_country_region(fig_plot_american, ax_plot_american, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_american.tight_layout()
fig_plot_american.savefig('{}/plots/price_rating_american.png'.format(folder), dpi=dpi)
# fig_plot_american.savefig('{}/plots/price_rating_american-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for Australia
plot_country = 5
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_australian, ax_plot_australian = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_australian, ax_plot_australian = \
    func_plot_country_region(fig_plot_australian, ax_plot_australian, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_australian.tight_layout()
fig_plot_australian.savefig('{}/plots/price_rating_australian.png'.format(folder), dpi=dpi)
# fig_plot_australian.savefig('{}/plots/price_rating_australian-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for Portugeuse
plot_country = 7
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_portugeuse, ax_plot_portugeuse = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_portugeuse, ax_plot_portugeuse = \
    func_plot_country_region(fig_plot_portugeuse, ax_plot_portugeuse, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_portugeuse.tight_layout()
fig_plot_portugeuse.savefig('{}/plots/price_rating_portugeuse.png'.format(folder), dpi=dpi)
# fig_plot_portugeuse.savefig('{}/plots/price_rating_portugeuse-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for Argentinian
plot_country = 8
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_argentinian, ax_plot_argentinian = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_argentinian, ax_plot_argentinian = \
    func_plot_country_region(fig_plot_argentinian, ax_plot_argentinian, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_argentinian.tight_layout()
fig_plot_argentinian.savefig('{}/plots/price_rating_argentinian.png'.format(folder), dpi=dpi)
# fig_plot_argentinian.savefig('{}/plots/price_rating_argentinian-multiple-regions-only.png'.format(folder), dpi=dpi)

# Plot all wine regions for Chilean
plot_country = 9
data_country_regions = data_all[plot_country].sort_values('Region').reset_index(drop=True)
fig_plot_chilean, ax_plot_chilean = plt.subplots(figsize=(fig_size[0], fig_size[1]))
fig_plot_chilean, ax_plot_chilean = \
    func_plot_country_region(fig_plot_chilean, ax_plot_chilean, data_country_regions, markers, cm, legend=True, plot_singles=True)
fig_plot_chilean.tight_layout()
fig_plot_chilean.savefig('{}/plots/price_rating_chilean.png'.format(folder), dpi=dpi)
# fig_plot_chilean.savefig('{}/plots/price_rating_chilean-multiple-regions-only.png'.format(folder), dpi=dpi)

if __name__ == "__main__":
    print('Finished.')
    plt.show()
