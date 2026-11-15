# Mutiara Line route sources

**Sources reviewed: 15 November 2026 (Malaysia time).** The route and stations in `lib/officialMutiara.ts` are used by the existing construction map and area picker. Construction records in `lib/constructionNotices.ts` populate the existing cards, filters, details and map without a new interface.

## Route

- [MRT Corp station guide](https://laluanmutiara.mymrt.com.my/lrt-mutiara-line/): island station names and order; Macallum branch to Penang Sentral.
- [February 2026 revised railway scheme](https://www.mymrt.com.my/wp-content/uploads/2026/02/PML-PI-Notice-BW-ENG-1.pdf): 20 stations plus the provisional PSR-A and Bagan Luar stations. This dated scheme takes precedence over inconsistent station totals on the undated FAQ.
- [Segment 2 EIA executive summary](https://laluanmutiara.mymrt.com.my/wp-content/uploads/2026/03/EIA-PML-SEGMENT-2-EXECUTIVE-SUMMARY-DAN-RINGKASAN-EKSEKUTIF.pdf): published coordinates for Penang Sentral (100°22′4.52″E, 5°23′38.38″N) and Bagan Luar (100°22′6.41″E, 5°24′3.40″N), converted to decimal degrees.

Island stations use approximate anchors based on the localities/landmarks named in the guide. Connecting lines are schematic geographic connections, not official engineering geometry, track centrelines, station footprints or navigation routes. Separate segment arrays prevent a spurious line directly from KOMTAR to Penang Sentral.

## Construction notices

- [TA01814](https://www.mymrt.com.my/wp-content/uploads/2026/11/TA01814-FINAL.pdf): Tapak Pesta–JPJ Batu Uban, drainage and road widening; 9 November 2026–15 January 2027, 09:00–16:00 MYT.
- [TA01809](https://www.mymrt.com.my/wp-content/uploads/2026/11/TA01809-FINAL.pdf): Sunway Tunas–SPICE, road widening; 5 November–30 December 2026, 22:00–05:00 MYT next morning.
- [TA01807](https://www.mymrt.com.my/wp-content/uploads/2026/11/TA01807-FINAL.pdf): Sungai Pinang, utility relocation; 4 November–31 December 2026, 22:00–05:00 MYT next morning.
- [MRT Corp traffic listing](https://www.mymrt.com.my/traffic-announcement/?_sft_project-name=penang-mutiara-line): Jalan Magazine/Lebuh Carnarvon construction; 28 October 2026–31 August 2029, 24 hours. Its PDF could not be fetched, so only listing-supported facts are included and its issue date is unspecified.
- [TA01571](https://www.mymrt.com.my/wp-content/uploads/2026/04/TA01571-FINAL.pdf): JPJ Batu Uban–Sunny Point, piling and permanent structure works with lane diversions; 25 April–30 November 2026, 24 hours.

These are selected notices, manually reviewed, not a live or exhaustive feed. Restrictions are classified independently of the construction activity, so utility works are not incorrectly marked as an open road. Ended notice periods do not establish reopening or completion. Impact ratings and premises/pedestrian access were not specified in the reviewed notices and are not invented. No driving or pedestrian diversion geometry is supplied.

Shaded polygons indicate approximate localities, not official lane boundaries or worksite footprints. Source links and geometry accuracy are retained in GeoJSON exports. Midnight `lastUpdated` timestamps represent the date of data review, not a claimed publication time.

Browser records use the v2 storage key. When only v1 exists, untouched legacy fixtures are replaced while edited, unpublished and user-created records are retained. The v1 data remains as a backup. Staff edits to sourced records retain attribution with a local-edit flag. A reset writes the new defaults to v2 so v1 cannot reappear.

Run `node --test tests/*.test.mjs` and `npm run build` after changes. Data tests use native TypeScript support in Node 22.18+ or 24.
