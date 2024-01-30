var wait = async (ms) => new Promise((r) => setTimeout(r, ms));
var encoder = new TextEncoder();
var decoder = new TextDecoder();
var { writable, readable } = new TransformStream();
var abortable = new AbortController();
var { signal } = abortable;
var writer = writable.getWriter();
var settings = { url: "https://comfortable-deer-52.deno.dev", method: "post" };
fetch(settings.url, {
  duplex: "half",
  method: settings.method,
  // Bun does not implement TextEncoderStream, TextDecoderStream
  body: new ReadableStream({
    type: 'direct',
    async pull(controller) {
      let i = 0;
      while (i++ < 10) {
        const data = encoder.encode(i.toString() + '\n');
        controller.enqueue(data);
        await wait(1000);
      }
      controller.close();
    },
  }),
  signal,
})
  // .then((r) => r.body.pipeThrough(new TextDecoderStream()))
  .then((r) =>
    r.body.pipeTo(
      new WritableStream({
        async start() {
          this.now = performance.now();
          console.log(this.now);
          return;
        },
        async write(value) {
          console.log(decoder.decode(value));
        },
        async close() {
          console.log("Stream closed");
        },
        async abort(reason) {
          const now = ((performance.now() - this.now) / 1000) / 60;
          console.log({ reason });
        },
      }),
    )
  ).catch(async (e) => {
    console.log(e);
  });
await wait(1000);
await writer.write("test");
await wait(1500);
await writer.write("test, again");
await writer.close();
