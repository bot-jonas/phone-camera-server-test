import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import TcpSocket from 'react-native-tcp-socket';

const App = () => {
  const cameraRef = useRef(null);

  const server = TcpSocket.createServer(function(socket) {
  
  socket.on('data', (data) => {
    if(data == 'takePicture\n') {
      takePicture().then(r => {
        if(r === null) {
          socket.write('The picture was not taken');
        } else {
          socket.write(r);
        }
      });
    } else if(data == 'close\n') {
      server.close();
    } else {
      socket.write('Echo server ' + data);
    }
    
  });

  socket.on('error', (error) => {
    console.log('An error ocurred with client socket ', error);
  });

  socket.on('close', (error) => {
      console.log('Closed connection with ', socket.address());
    });
  }).listen({ port: 12345, host: '0.0.0.0' });

  server.on('error', (error) => {
    console.log('An error ocurred with the server', error);
  });

  server.on('close', () => {
    console.log('Server closed connection');
  });

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      cameraRef.current.resumePreview();
      const data = await cameraRef.current.takePictureAsync(options);
      cameraRef.current.pausePreview();
      console.log(data.uri);
      return data.base64;
    }

    return null;
  };

  useEffect(() => {
    return () => {
      console.log("Closing server in useEffect!");
      server.close();
    }
  }, []);

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default App;