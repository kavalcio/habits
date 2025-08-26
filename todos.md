Bugs
- Trying to delete habit causes foreign key constraint if it has any events. Either make the habit delete cascade to the events, or convert it to a soft delete
- Navigation doesn't work on prod, some issue with react router probably

Features
- undo button that reverts last event addition/removal
- day/week/month/year view somewhere?
- some animation on the home page. maybe an abacus-like line of boxes (similar to the progress box in the yearly grid) that move to the left or right on a string
  - maybe use anime.js
- modal for adding event. allows picking habit from a dropdown, date from a calendar (which format?)
- in dashboard view, overall progress that shows events for all habits (similar to Habitify)
- Some analytics and graphs on habit details page
- pick a custom color palette using this: https://www.radix-ui.com/colors/custom
- Add custom favicon
- Allow restoring archived habits, maybe from profile page
- Add custom page scrollbar style
- Add ability to add tags/descriptions to events
  - e.g. muscle group for workouts
- add a promo page at root '/'
- allow importing events from csv
- allow exporting events to csv
- allow adding tags/quantifiers/qualifiers to events?
  - allow filtering/grouping by these qualifiers/quantifiers?
- allow adding multiple events per day? nah

Improvement
- optimization: prefetch habit data when user hovers on the habit card on the dashboard, before they even click

Notes
- Name options
  - Turkish
    - Ahenk - "harmony"
    - Düzen - "order"
    - Zaman – "time"
  - Latin/Greek
    - Ordo – “Order” or “structure”
    - Iter – “Journey” or “path”
    - Telos (Τέλος) – “End goal” or purpose
    - Metis (Μῆτις) – “Wisdom through craft/practice”
    - Praxis - applied practice; where theory becomes habit
  - English
    - Waypoint
    - Chisel
    - Forge
    - Foundry
    - Lathe
    - Temper
    - Etch
    - Axis
    - Keystone (already exists as a habit tracking app)
