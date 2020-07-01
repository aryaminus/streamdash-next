# <p align="center"> StreamDash</p>
<p align="center">
  <img alt="icon" src="https://i.imgur.com/NNUKJ4y.png" width="120" height="120"> 
</p>

Streaming might look like a dream thing but being bombarded by thousands in a minute does feel overwhelming. So, have a plan to make a neat looking dashboard that will be used for real-time analytics.

**Prod**: https://streamdash.xyz/ 🚨 Not Deployed

**Dev**: https://streamdash.herokuapp.com/

## Technical Tools
- Github Issues and Project
- Next.js
- Zeit 🚨 No serverless support
- Heroku
- Speech API
- Styled Components

## TODO
- [ ] Use the Speech API to remove the messages after being read by the streamer
- [ ] Don't rely on Youtube API only, introduce Twitch / Mixer API
- [ ] Change the Sppech API to Google Speech recognition
- [ ] Add More analytics dashboard with word cloud for the normal audience
- [x] Show the author name on the chat message

## Current problems
- [ ] Relied just on Next.js with no database connected, just local memory, bound to run out of it
- [ ] Speech APi is flimsy and slow, try saying `Dash Stop` you will get the point. So make a native app instead to do the task
- [ ] Add more analytics and a way to check back on the historical data
- [ ] Show the viewership growth and decline on the basis of timestamp
- [ ] Maybe just scrape the youtube chat Data from a server? Kept running out of the quota

## Reference
I forgot where I took design inspiration from, if you know, please open a PR or a ticket.

## Authors
- <a href="https://github.com/aryaminus" target="_blank">© Sunim Acharya</a>

## Licensing
The code in this project is unlicensed.
