Bugs
- on going away from the tab and coming back, queries get refetched. could be a config of useQuery, or could be a react shenanigan
- some custom colors dont work for the light theme, fix those
- In profile page edit forms, nordpass thinks pressing Edit or Cancel counts as logging in

Features
- allow pinning habits, and only show pinned habits on dashboard
  - Allow picking which habits are shown on the ScrollingActivity component
  - allow changing the order of habits (at least the pinned ones)
- add the home page abacus animation to page logo on the top left, but only play when hovered
- Add custom page scrollbar style
- allow importing events from csv
- allow exporting events to csv
- allow filtering/grouping events by tag?
- google oauth
- allow picking an icon for each habit
- undo button that reverts last event addition/removal

Improvements
- Daily Log dialog looks a bit outdated now, polish it
- use Callout element when showing error on screen
- can we memoize queries between pages? we keep refetching habit/event data
  - This might already be a thing
- optimization: prefetch habit data when user hovers on the habit card on the dashboard, before they even click
- submit login/register form on enter key press
- for the dashboard scrollingactivity, can we stagger event data fetch (by date), instead of fetching all at once?

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
