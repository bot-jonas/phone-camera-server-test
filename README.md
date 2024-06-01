Simple phone camera server test.
You can send a takePicture command (e.g. through netcat) to take a picture, the returned value will be the base64 image.
```sh
echo takePicture | netcat -w 2 10.0.0.86 12345 
```
