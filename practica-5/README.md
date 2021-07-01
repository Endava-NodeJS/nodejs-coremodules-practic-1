### Video file archive creation

***What we have to implement:***

1) Create /video-download endpoint.
2) Create Readable stream that will read the file.
3) Transform file using [zlib module](https://nodejs.org/api/zlib.html#zlib_zlib).
4) Use pipeline method from stream module to read, transform and write the file to the response
   object. [pipeline](https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback)
5) Return transformed file as a response.

### Video streaming

***What we have to implement:***

1) Create a readable stream for the file "flowers.mp4" in the public/video directory.
2) Send video chunk by chunk as a response for the GET /video, sending 206 status code.

Chunk should be sliced from the file, with size based
on ['Range'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range) header (if provided). Also, be aware
of ['Accept-Ranges'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Ranges)
and ['Content-Range'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range) headers. They have to be
sent as a response.

Here are some other headers that should be taken in consideration 'Content-Length': [chunk size],'Content-Type': '
video/mp4'.

***Some useful links:***

- Article that covers all use cases https://betterprogramming.pub/video-stream-with-node-js-and-html5-320b3191a6b6