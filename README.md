# Bubble Portfolio

The idea of this site is to make the portfolio itself feel like an interactive experience rather than a normal gallery of projects. Most portfolios are basically a list of case studies or pages you click through, but since most of my work is UX, digital experiences and video, I thought it would be more interesting if the navigation itself felt like a designed interaction.

The current concept is a bubble based interface floating in a dark space. The big bubble in the center represents me, and when you click on it, it splits into smaller bubbles that represent categories of my work. Those bubbles can then split again into projects, and then again into smaller bubbles with details like photos, descriptions, process etc. So it's basically a portfolio that behaves more like a mind map or folder system rather than separate pages.

Everything runs on one page so there aren't actually any page transitions. The whole idea is that it feels like you're exploring my mind rather than navigating between my projects.

# Process
Originally this portfolio wasn't supposed to be bubbles at all. The first idea I worked on was a restaurant menu themed portfolio where each project would appear like a dish on a menu. The page title would have my name, job title and portfolio, and you could flip through the pages like a physical restaurant menu.

This version had a page flip animation and arrows on both sides of the screen to move between pages. It worked fine but it still felt like a pretty normal website with a visual gimmick on top of it. I wanted something that felt more interactive and exploratory.

After thinking about different concepts for a while, I ended up switching to the bubble interface idea. The goal was to make the navigation feel more spatial, like you’re exploring ideas in my head instead of opening folders.

The basic structure became something like:

main bubble (me)
- category bubbles (UX, cinematography, graphic design etc)
- project bubbles 
- detail bubbles (photo, process, description, outcome etc)

So every bubble acts kind of like a folder that can split open into smaller bubbles.

The first version of the bubble system was built using actual 3D sphere (and alot of ChatGPT)

I ran into a few problems with this version. It was pretty cool as it had camera rotations in a 3d space but ultimately I find it not a graceful direction and hard to navigate. Some browsers had issues with the material rendering and the bubbles would just appear invisible. Also some of the control systems caused errors if the scripts didn’t load properly. 

So instead of forcing the 3D version to work, I rebuilt it as a 2D bubble system which actually worked much better and was easier to control.

Right now the site uses a pretty simple set of controls:

left click: open/close bubble
right click: pan
scroll wheel: zoom
recenter button: bring the camera back to the main bubble

