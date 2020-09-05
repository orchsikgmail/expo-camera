import React, { Component, createRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera, requestPermissionsAsync } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import Axios from 'axios';
import * as FileSystem from 'expo-file-system';

import Colors from '../constants/Colors';

class MyCam extends Component {
  cam = createRef();
  state = {
    video: null,
    picture: null,
    recording: false,
  };

  componentDidMount = () => {
    setTimeout(() => {
      this.startRecord();
    }, 10);
  };

  componentWillUnmount = () => {
    // console.log('componentWillUnmount');
  };

  startRecord = async () => {
    // console.log('startRecord');
    if (this.cam) {
      this.setState({ recording: true }, async () => {
        try {
          const video = await this.cam.recordAsync({
            maxDuration: 3,
            // quality: '2160p', 안됨 우리패드에서 지원암함
            // quality: '1080p',
            quality: '480p',
          });
          // console.log('startRecordResult', video);

          this.setState({ video }, () => {
            const result = this.saveVideo();
            this.props.offCamera();
          });
        } catch (error) {
          console.warn(error);
        }
      });
    }
  };

  stopRecord = async () => {
    console.log('stopRecord');
    this.setState({ recording: false }, () => {
      const result = this.cam.stopRecording();
      // console.log('stopRecordingResult', result);
    });
  };

  toogleRecord = () => {
    const { recording } = this.state;
    if (recording) this.stopRecord();
    else this.startRecord();
  };

  saveVideo = async () => {
    // console.log('saveVideo');
    const { video } = this.state;
    try {
      const API_URL = 'http://pams.server.ngrok.io';

      // 갤러리에 저장
      const asset = await MediaLibrary.createAssetAsync(video.uri);
      console.log(asset);
      // Object {
      //   "albumId": "-2075821635",
      //   "creationTime": 1597917177000,
      //   "duration": 30.058,
      //   "filename": "3252a505-f41e-4b70-a3f9-d727b9e3a3cd.mp4",
      //   "height": 720,
      //   "id": "1882",
      //   "mediaType": "video",
      //   "modificationTime": 1597917177000,
      //   "uri": "file:///storage/emulated/0/DCIM/3252a505-f41e-4b70-a3f9-d727b9e3a3cd.mp4",
      //   "width": 480,
      // }

      const filename = `${Date.now()}.mp4`;
      const formData = new FormData();
      formData.append('files', {
        uri: video.uri,
        type: 'video/mp4',
        name: filename,
      });

      const response = await Axios.post(`${API_URL}/api/app/test/video`, formData);
      // console.log(response.data);
    } catch (error) {
      console.warn(error);
    } finally {
      // this.stopRecord();
      // this.setState({ video: null });
    }
  };

  render() {
    // console.log('render');
    const { recording, video } = this.state;

    return (
      <Camera
        type="back"
        ref={(ref) => (this.cam = ref)}
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          flex: 1,
          width: '100%',
        }}
      >
        {video ? (
          <TouchableOpacity
            onPress={this.saveVideo}
            style={{
              padding: 20,
              width: '100%',
              backgroundColor: '#fff',
            }}
          >
            <Text style={{ textAlign: 'center' }}>save</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={this.toogleRecord}
          style={{
            padding: 20,
            width: '100%',
            backgroundColor: recording ? '#ef4f84' : '#4fef97',
          }}
        >
          <Text style={{ textAlign: 'center' }}>{recording ? 'Stop' : 'Record'}</Text>
        </TouchableOpacity>
      </Camera>
    );
  }
}

class RecVideo extends Component {
  state = {
    showCamera: false,
    showAudio: false,
    showMedia: false,
  };

  offCamera = () => {
    this.setState({ showCamera: false });
  };

  _showCamera = async () => {
    const { status } = await requestPermissionsAsync();
    const { status: statusA } = await Audio.requestPermissionsAsync();
    const { status: statusM } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') this.setState({ showCamera: true });
    if (statusA === 'granted') this.setState({ showAudio: true });
    if (statusM === 'granted') this.setState({ showMedia: true });
  };

  render() {
    const { showCamera, showAudio, showMedia } = this.state;
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          width: '100%',
        }}
      >
        {showCamera && showAudio && showMedia ? (
          <MyCam offCamera={this.offCamera} />
        ) : (
          <TouchableOpacity onPress={this._showCamera}>
            <Text style={{ color: Colors.dark.text }}> Show Camera </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default RecVideo;
// 파일시스템 이용 binaryUpload
// const response = await FileSystem.uploadAsync(
//   `${API_URL}/binaryUpload`,
//   video.uri,
//   {
//     uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
//     httpMethod: "PATCH",
//   }
// );

// 파일시스템 이용 multipartUpload
// const response = await FileSystem.uploadAsync(
//   `${API_URL}/multipartUpload`,
//   video.uri,
//   {
//     headers: {
//       "content-type": "multipart/form-data",
//       apikey: "API_KEY",
//     },
//     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
//     fieldName: "file",
//     mimeType: "video/mp4",
//     parameters: {
//       language: "eng",
//       isOverlayRequired: "False",
//     },
//     httpMethod: "PATCH",
//   }
// );

// 갤러리에 저장
// const asset = await MediaLibrary.createAssetAsync(video.uri);
