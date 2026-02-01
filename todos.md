Bugs
- make header look ok on mobile
- Trying to delete habit causes foreign key constraint if it has any events. Either make the habit delete cascade to the events, or convert it to a soft delete
- on going away from the tab and coming back, queries get refetched. could be a config of useQuery, or could be a react shenanigan

Core Features
- in dashboard view, overall progress that shows events for all habits (similar to Habitify)
- Some analytics and graphs on habit details page
  - rolling weekly/monthly average graph
- Add custom favicon
- add a promo page at root '/'
- Allow restoring archived habits, maybe from profile page
- improve the login/register pages
- add more toast for more actions
- password 
- 404 page

Optional Features
- allow changing the order of habits
- undo button that reverts last event addition/removal
- day/week/month/year view somewhere?
- some animation on the home page. maybe an abacus-like line of boxes (similar to the progress box in the yearly grid) that move to the left or right on a string
  - maybe use anime.js
- pick a custom color palette using this: https://www.radix-ui.com/colors/custom
- Add custom page scrollbar style
- allow importing events from csv
- allow exporting events to csv
- allow adding tags/quantifiers/qualifiers to events?
  - e.g. muscle group for workouts
  - allow filtering/grouping by these qualifiers/quantifiers?
- google oauth

Improvement
- use Callout element when showing error on screen
- can we memoize queries between pages? we keep refetching habit/event data
- optimization: prefetch habit data when user hovers on the habit card on the dashboard, before they even click
- submit login/register form on enter key press

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
