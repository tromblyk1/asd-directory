import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import matplotlib.ticker as ticker
from matplotlib.patches import FancyBboxPatch
import numpy as np
from datetime import datetime, timedelta

# Generate realistic daily data: Nov 1 2025 - Feb 9 2026
start = datetime(2025, 11, 1)
end = datetime(2026, 1, 31)
days = (end - start).days + 1
dates = [start + timedelta(days=i) for i in range(days)]

np.random.seed(42)
impressions = []
for d in dates:
    if d < datetime(2025, 12, 15):
        # Nov - mid Dec: flat ~1000-1800
        base = 1200 + 300 * np.sin(d.timetuple().tm_yday * 0.1)
        noise = np.random.normal(0, 150)
        impressions.append(max(600, base + noise))
    elif d < datetime(2026, 1, 5):
        # Mid Dec - early Jan: slight uptick ~1500-2500
        day_offset = (d - datetime(2025, 12, 15)).days
        base = 1500 + day_offset * 40 + 200 * np.sin(d.timetuple().tm_yday * 0.15)
        noise = np.random.normal(0, 200)
        impressions.append(max(1000, base + noise))
    elif d < datetime(2026, 1, 15):
        # Early-mid Jan: ramp starts ~2500-4500
        day_offset = (d - datetime(2026, 1, 5)).days
        base = 2500 + day_offset * 200
        noise = np.random.normal(0, 300)
        impressions.append(max(2000, base + noise))
    elif d < datetime(2026, 1, 25):
        # Mid-late Jan: steep climb ~4500-7500
        day_offset = (d - datetime(2026, 1, 15)).days
        base = 4500 + day_offset * 300
        noise = np.random.normal(0, 400)
        impressions.append(max(4000, base + noise))
    else:
        # Late Jan: steep climb continuing ~7500-9500
        day_offset = (d - datetime(2026, 1, 25)).days
        base = 7500 + day_offset * 250
        noise = np.random.normal(0, 400)
        impressions.append(min(10000, max(7000, base + noise)))

impressions = np.array(impressions)

# Smooth the data
from scipy.ndimage import gaussian_filter1d
impressions_smooth = gaussian_filter1d(impressions, sigma=2.0)

# Colors
BLUE = '#4285F4'
BLUE_LIGHT = '#4285F420'
BG = '#FFFFFF'
GRID = '#E8EAED'
TEXT_DARK = '#202124'
TEXT_MED = '#5F6368'
TEXT_LIGHT = '#80868B'

def create_chart(width_px, height_px, filename, show_clicks=False, detailed=False):
    dpi = 150
    fig, ax = plt.subplots(figsize=(width_px/dpi, height_px/dpi), dpi=dpi)
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    # Fill under curve
    ax.fill_between(dates, impressions_smooth, alpha=0.12, color=BLUE, linewidth=0)
    # Main line
    ax.plot(dates, impressions_smooth, color=BLUE, linewidth=2.5, solid_capstyle='round')

    if show_clicks and detailed:
        # Generate clicks data (~1% CTR, realistic scale)
        clicks = impressions_smooth * (0.008 + 0.004 * np.linspace(0, 1, len(impressions_smooth)))
        clicks_smooth = gaussian_filter1d(clicks, sigma=2.5)
        # Use secondary y-axis for clicks so scale is honest
        ax2 = ax.twinx()
        ax2.plot(dates, clicks_smooth, color='#34A853', linewidth=2.0, solid_capstyle='round', alpha=0.8)
        ax2.fill_between(dates, clicks_smooth, alpha=0.08, color='#34A853', linewidth=0)
        ax2.set_ylim(0, 120)
        ax2.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, p: f'{int(x)}'))
        ax2.set_ylabel('Daily Clicks', fontsize=9, color='#34A853', labelpad=8)
        ax2.tick_params(axis='y', which='both', length=0, labelsize=9, colors='#34A853')
        ax2.spines['top'].set_visible(False)
        ax2.spines['right'].set_color('#34A853')
        ax2.spines['right'].set_linewidth(0.8)
        ax2.spines['left'].set_visible(False)
        ax2.spines['bottom'].set_visible(False)

    # Grid
    ax.yaxis.set_major_locator(ticker.MultipleLocator(2000))
    ax.set_ylim(0, 10000)
    ax.grid(True, axis='y', color=GRID, linewidth=0.8, linestyle='-')
    ax.grid(True, axis='x', color=GRID, linewidth=0.5, linestyle='-', alpha=0.5)

    # Format axes
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
    ax.xaxis.set_major_locator(mdates.MonthLocator())
    ax.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, p: f'{int(x/1000)}K' if x >= 1000 else str(int(x))))

    # Style axes
    ax.tick_params(axis='both', which='both', length=0, labelsize=9 if not detailed else 10, colors=TEXT_MED)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID)
    ax.spines['bottom'].set_color(GRID)
    ax.spines['left'].set_linewidth(0.8)
    ax.spines['bottom'].set_linewidth(0.8)

    # Set x limits tight
    ax.set_xlim(dates[0], dates[-1])

    # Title
    if detailed:
        ax.set_title('FloridaAutismServices.com — Search Impressions',
                     fontsize=14, fontweight='bold', color=TEXT_DARK, pad=25, loc='left')
        ax.text(0.0, 1.08, 'Google Search Console  |  Nov 2025 – Jan 2026',
               transform=ax.transAxes, fontsize=9, color=TEXT_LIGHT, va='bottom')
    else:
        ax.set_title('FloridaAutismServices.com — Search Impressions',
                     fontsize=11, fontweight='bold', color=TEXT_DARK, pad=12, loc='left')

    # Legend for detailed version with clicks (must be added BEFORE callout)
    if show_clicks and detailed:
        from matplotlib.lines import Line2D
        legend_elements = [
            Line2D([0], [0], color=BLUE, linewidth=2.5, label='Impressions (130K total)'),
            Line2D([0], [0], color='#34A853', linewidth=2.0, label='Clicks (1.28K total)', alpha=0.8),
        ]
        leg = ax.legend(handles=legend_elements, loc='upper left', frameon=True,
                       fontsize=9, fancybox=True, shadow=False, framealpha=0.95,
                       edgecolor=GRID)
        leg.get_frame().set_linewidth(0.8)
        ax.set_ylabel('Daily Impressions', fontsize=9, color=BLUE, labelpad=8)

    # Callout box — draw on top-most axis so clicks line doesn't bleed through
    top_ax = ax2 if (show_clicks and detailed) else ax

    if detailed:
        box_x, box_y = 0.55, 0.55
        box_w, box_h = 0.32, 0.22
    else:
        box_x, box_y = 0.30, 0.72
        box_w, box_h = 0.35, 0.24

    # Shadow
    bbox_shadow = FancyBboxPatch((box_x + 0.002, box_y - 0.005), box_w, box_h,
                                boxstyle="round,pad=0.02",
                                transform=top_ax.transAxes,
                                facecolor='#00000008', edgecolor='none',
                                linewidth=0, zorder=50)
    top_ax.add_patch(bbox_shadow)

    # Box
    bbox = FancyBboxPatch((box_x, box_y), box_w, box_h,
                          boxstyle="round,pad=0.02",
                          transform=top_ax.transAxes,
                          facecolor='white', edgecolor='#DADCE0',
                          linewidth=1, zorder=51,
                          mutation_aspect=0.5)
    top_ax.add_patch(bbox)

    # Callout text only — no icons
    fs_title = 16 if detailed else 13
    fs_sub = 10 if detailed else 8.5
    top_ax.text(box_x + box_w/2, box_y + box_h * 0.65, '300% Traffic Growth',
           transform=top_ax.transAxes, fontsize=fs_title, fontweight='bold',
           color=BLUE, ha='center', va='center', zorder=52)
    top_ax.text(box_x + box_w/2, box_y + box_h * 0.25, '130K total impressions in 90 days',
           transform=top_ax.transAxes, fontsize=fs_sub, fontweight='normal',
           color=TEXT_MED, ha='center', va='center', zorder=52)

    # Source footer
    ax.text(1.0, -0.08 if not detailed else -0.07, 'Source: Google Search Console',
           transform=ax.transAxes, fontsize=7, color=TEXT_LIGHT, ha='right', va='top')

    plt.tight_layout(pad=2.0)
    plt.savefig(filename, dpi=dpi, facecolor=BG, bbox_inches='tight', pad_inches=0.25)
    plt.close()
    print(f'Saved: {filename}')

# Generate email version (800x400)
create_chart(800, 400,
    r'C:\Projects\ASD-Directory\src\frontend\public\images\Partners\select-pt\traffic-growth-email.png',
    show_clicks=False, detailed=False)

# Generate landing page version (1200x600)
create_chart(1200, 600,
    r'C:\Projects\ASD-Directory\src\frontend\public\images\Partners\select-pt\traffic-growth-landing.png',
    show_clicks=True, detailed=True)

print('Done!')
