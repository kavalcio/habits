Bugs
- Trying to delete habit causes foreign key constraint if it has any events. Either make the habit delete cascade to the events, or convert it to a soft delete
- on going away from the tab and coming back, queries get refetched. could be a config of useQuery, or could be a react shenanigan
- some custom colors dont work for the light theme, fix those

Core Features
- in dashboard view, overall progress that shows events for all habits (similar to Habitify)
- Some analytics and graphs on habit details page
  - rolling weekly/monthly average graph
- Add custom favicon
- add a promo/index page at root '/'
- add more toasts for more actions
- 404 page
- error boundary page

Optional Features
- allow pinning habits, and only show pinned habits on dashboard
- allow changing the order of habits (at least the pinned ones)
- undo button that reverts last event addition/removal
- some animation on the home page. maybe an abacus-like line of boxes (similar to the progress box in the yearly grid) that move to the left or right on a string
  - maybe use anime.js
  - maybe add the same animation to page logo on the top left, but only play when hovered
- Add custom page scrollbar style
- allow importing events from csv
- allow exporting events to csv
- allow adding tags/quantifiers/qualifiers to events?
  - e.g. muscle group for workouts
  - allow filtering/grouping by these qualifiers/quantifiers?
- google oauth
- allow picking an icon for each habit

Improvement
- use Callout element when showing error on screen
- can we memoize queries between pages? we keep refetching habit/event data
- optimization: prefetch habit data when user hovers on the habit card on the dashboard, before they even click
- submit login/register form on enter key press
- add aria tags everywhere

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
