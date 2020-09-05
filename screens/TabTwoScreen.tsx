import * as React from 'react';
import { StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Axios from 'axios';

import { Text, View } from '../components/Themed';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function TabTwoScreen() {
  const readAsStringAsync = async () => {
    const API_URL = 'http://c3148d0c45fc.ngrok.io';
    const fileUri = 'file:///storage/emulated/0/DCIM/4b0b12d2-16ec-48eb-a3da-818a211ea0ca.mp4';
    const contentType = 'video/mp4';
    const filename = `1597973490002.mp4`;

    const length = 1000 * 444; // 대략 1초의 길이 (480p 기준)
    let recordCnt = 1;
    let position = 0;
    let finish = 0;
    while (true) {
      const video_segment = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
        length,
        position,
      });

      if (finish === 1) break;
      if (video_segment.length === 0) finish = 1;

      Axios.post(`${API_URL}/api/usr_itv/record/video`, {
        video_segment,
        contentType,
        filename,
        recordCnt,
        finish,
      });

      recordCnt++;
      position += length;
    }

    // let requestArgs = new Array();
    // let recordCnt = 0;
    // console.log({ file_string_size });
    // for (let position = 0; position <= file_string_size; position += length) {
    //   requestArgs.push({ position, recordCnt });
    //   recordCnt++;
    // }
    // for (const data of requestArgs) {
    //   const { position, recordCnt } = data;
    //   const video_segment = await FileSystem.readAsStringAsync(fileUri, {
    //     encoding: FileSystem.EncodingType.Base64,
    //     length,
    //     position,
    //   });
    //   console.log(video_segment.length);

    //   if (video_segment.length === 0) {
    //     console.log(position);
    //     continue;
    //   }
    //   Axios.post(`${API_URL}/api/usr_itv/record/video`, {
    //     video_segment,
    //     contentType,
    //     filename,
    //     recordCnt,
    //   });
    // }
    // // 한방에 보내기
    // const video_segment = await FileSystem.readAsStringAsync(fileUri, {
    //   encoding: FileSystem.EncodingType.Base64,
    // });
    // Axios.post(`${API_URL}/api/usr_itv/record/video`, {
    //   video_segment,
    //   contentType,
    //   filename,
    // });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={readAsStringAsync}>
        <Text style={styles.title}>upload video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
