const { EventEmitter } = require("events");

/**
 * The main hub for acquire live chat with the YouTube Date API.
 * @extends {EventEmitter}
 */
export default class YouTube extends EventEmitter {
  /**
   * @param {string} ChannelID ID of the channel to acquire with
   * @param {string} APIKey You'r API key
   */
  constructor(channelId, apiKey) {
    super();
    this.id = channelId;
    this.key = apiKey;
    this.getLive();
  }

  getLive() {
    const url =
      "https://www.googleapis.com/youtube/v3/search" +
      "?eventType=live" +
      "&part=id" +
      `&channelId=${this.id}` +
      "&type=video" +
      `&key=${this.key}`;
    this.request(url, (data) => {
      console.log(data, this.id, this.key);
      this.liveId =
        data && data.items && data.items[0] && data.items[0].id.videoId;
      this.getChatId();
    });
  }

  getChatId() {
    const url =
      "https://www.googleapis.com/youtube/v3/videos" +
      "?part=liveStreamingDetails" +
      `&id=${this.liveId}` +
      `&key=${this.key}`;
    this.request(url, (data) => {
      this.chatId =
        data &&
        data.items &&
        data.items[0] &&
        data.items[0].liveStreamingDetails.activeLiveChatId;
      this.emit("ready");
    });
  }

  /**
   * Gets live chat messages.
   * See {@link https://developers.google.com/youtube/v3/live/docs/liveChatMessages/list#response|docs}
   * @return {object}
   */
  getChat() {
    if (!this.chatId) return this.emit("error", "Chat id is invalid.");
    const url =
      "https://www.googleapis.com/youtube/v3/liveChat/messages" +
      `?liveChatId=${this.chatId}` +
      "&part=id,snippet,authorDetails" +
      "&maxResults=2000" +
      `&key=${this.key}`;
    this.request(url, (data) => {
      this.emit("json", data);
    });
  }

  request(url, callback) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => this.emit("error", error));
  }

  /**
   * Gets live chat messages at regular intervals.
   * @param {number} delay Interval to get live chat messages
   * @fires YouTube#message
   */
  listen(delay) {
    let lastRead = 0,
      time = 0;
    this.interval = setInterval(() => this.getChat(), delay);
    this.on("json", (data) => {
      for (const item of data.items) {
        time = new Date(item.snippet.publishedAt).getTime();
        if (lastRead < time) {
          lastRead = time;
          /**
           * Emitted whenever a new message is recepted.
           * See {@link https://developers.google.com/youtube/v3/live/docs/liveChatMessages#resource|docs}
           * @event YouTube#message
           * @type {object}
           */
          this.emit("message", item);
        }
      }
    });
  }

  /**
   * Stops getting live chat messages at regular intervals.
   */
  stop() {
    clearInterval(this.interval);
  }
}
