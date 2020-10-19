# RingCentral Embeddable Video Demo

This demo shows how to integrate RingCentral Video using [RingCentral Embeddable web widget](https://github.com/ringcentral/ringcentral-embeddable).

You can try out a live demo here:

* Live Demo: [https://ringcentral.github.io/ringcentral-embeddable-rcv-demo/index.html](https://ringcentral.github.io/ringcentral-embeddable-rcv-demo/index.html)

You an inspect the demo source code here:

* Main Source Code: [index.jsx](src/client/index.jsx)

## Usage

```bash
# Install code
$ git clone https://github.com/ringcentral/ringcentral-embeddable-rcv-demo

$ cd ringcentral-embddable-rcv-demo
$ npm i
$ cp .env.sample .env

# start local server
npm start

# build code
npm run build

# then visit http://{RINGCENTRAL_HOST}:{RINGCENTRAL_PORT}
```

Once tbe web page is up, login with a RingCentral Sandbox account and then use the demo to open the Embeddable meeting panel or dial a phone number.

## License

MIT
