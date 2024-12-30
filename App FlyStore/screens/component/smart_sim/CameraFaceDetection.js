import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImageResizer from 'react-native-image-resizer';
import json_language from '../../json/language.json';
// import { OpenCV } from 'opencv';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
// import { cv } from 'react-native-opencv';

const App = ({
  open_camera_dectection,
  set_open_camera_dectection,
  selfies,
  set_selfies,
  language,
  photo,
  set_photo,
  deleteURI,
}) => {
  const [type, setType] = useState(RNCamera.Constants.Type.front);
  const [box, setBox] = useState(null);
  const cameraRef = useRef(null);
  const [open, set_open] = useState('red');
  const handlerFace = ({faces}) => {
    if (faces && faces.length > 0 && faces[0]) {
      const face = faces[0];
      const {origin, size} = face.bounds;

      if (origin?.y !== undefined && size?.height !== undefined) {
        const faceX = origin.x + size.width / 2;
        const faceY = origin.y + size.height / 2;
        const screenCenterX = width / 2;
        const screenCenterY = height / 2;

        setBox({
          boxs: {
            width: faces[0].bounds.size.width,
            height: faces[0].bounds.size.height,
            x: faces[0].bounds.origin.x,
            y: faces[0].bounds.origin.y,
            yawAngle: faces[0].yawAngle,
            rollAngle: faces[0].rollAngle,
          },
          rightEyePosition: faces[0].rightEyePosition,
          leftEyePosition: faces[0].leftEyePosition,
          bottomMounthPosition: faces[0].bottomMounthPosition,
        });
        // console.log(faceX, faceY)
        // console.log(screenCenterX, screenCenterY)
        // console.log(faces[0].bounds.size.width, faces[0].bounds.size.height)
        //trung tâm: 180 362.25  150:210 280-320
        //195 303
        //210 291
        //200 324
        set_open('red');
        if (
          faceX >= screenCenterX + 5 &&
          faceX <= screenCenterX + 40 &&
          faceY >= screenCenterY - 25 &&
          faceY <= screenCenterY + 10
        ) {
          // console.log('vô')
          set_open('blue');
          takePicture('Face.jpg', set_image_Face);
          // console.log('Ở giữa');
          // takePicture("Face.jpg", set_image_Face)
        }
        if (faceX >= screenCenterX + 41 || faceY <= screenCenterY - 26) {
          set_instruct(json_language['Vui lòng di chuyển ra xa hơn'][language]);
        } else {
          set_instruct(
            json_language['Vui lòng đặt khuôn mặt vào giữa khung hình'][
              language
            ],
          );
        }
        // if (faces[0].bounds.size.width >= 190 && faces[0].bounds.size.width <= 210) {
        //     console.log('ảnh tốt')
        // }
        // else {
        //     console.log('ảnh xấu')
        // }
      }
    } else {
      setBox(null);
    }
  };

  const getUriFileSize = async uri => {
    try {
      const fileStat = await RNFS.stat(uri);
      const fileSizeInBytes = fileStat.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Chuyển đổi thành MB

      console.log('Kích thước của tệp URI:', fileSizeInMB.toFixed(2) + 'MB');
    } catch (error) {
      console.error('Lỗi khi lấy kích thước của tệp URI:', error);
    }
  };
  const [image_Face, set_image_Face] = useState(null);
  const [image_CCCD, set_image_CCCD] = useState('s');
  const reduceImageResolution = async imageUri => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        imageUri,
        500, // Độ rộng mới mong muốn
        500, // Chiều cao mới mong muốn
        'JPEG', // Định dạng hình ảnh (JPEG, PNG, ...)
        50, // Chất lượng hình ảnh mới (0-100)
        0, // Góc xoay hình ảnh (0, 90, 180, 270)
      );
      await deleteURI(imageUri);
      // Sử dụng resizedImage.uri để làm việc với hình ảnh đã được giảm độ phân giải
      // console.log('URI của hình ảnh đã giảm độ phân giải:', resizedImage.uri);
      // getUriFileSize(resizedImage.uri)
      set_photo({...photo, selfies: resizedImage.uri});
    } catch (error) {
      console.error('Lỗi khi giảm độ phân giải hình ảnh:', error);
    }
  };

  const takePicture = async (filename, set_image) => {
    if (cameraRef.current) {
      try {
        const options = {quality: 0.5, base64: true};
        const data = await cameraRef.current.takePictureAsync(options);
        set_photo({...photo, selfies: data.uri});
        set_image(data.uri);
        // getUriFileSize(data.uri)
        await reduceImageResolution(data.uri);
        set_open_camera_dectection(false);
        // savePicture(data.uri, filename)
      } catch (error) {
        console.log(error);
      }
    }
  };
  const savePicture = async (uri, filename) => {
    const folderPath = RNFS.ExternalDirectoryPath;
    // const fileName = "test1.jpg";
    const fileUri = `${folderPath}/${filename}`;
    console.log(folderPath);
    if (!(await RNFS.exists(folderPath))) {
      console.log('Saved');
      await RNFS.mkdir(folderPath, {intermediates: true});
    }

    await RNFS.copyFile(uri, fileUri);
  };
  const comparing = async () => {
    console.log('comparing1');
    setBox(null);
    set_image_CCCD('');
    set_image_Face('');
  };
  const [facesDetected, setFacesDetected] = useState(false);
  const [instruct, set_instruct] = useState(
    json_language['Vui lòng đặt khuôn mặt vào giữa khung hình'][language],
  );
  useEffect(() => {
    if (!facesDetected) {
      setBox(null);
    }
  }, [facesDetected]);
  return (
    <Modal
      animationType="slide-down"
      transparent={false}
      visible={open_camera_dectection}
      onRequestClose={() => {
        set_open_camera_dectection(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <View style={[styles.container]}>
        <View style={styles.container}>
          <View
            style={{
              height: 50,
              position: 'absolute',
              width: '100%',
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: !image_CCCD ? 22 : 16, color: '#000000'}}>
              {!image_CCCD
                ? 'CCCD'
                : 'Vui lòng đặt khuôn mặt ở giữa khung hình'}
            </Text>
          </View>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            captureMirrorImage={true}
            type={image_CCCD ? type : RNCamera.Constants.Type.back}
            captureAudio={false}
            onFacesDetected={handlerFace}
            faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
            faceDetectionLandmarks={
              RNCamera.Constants.FaceDetection.Landmarks.all
            }
            faceDetectionClassifications={
              RNCamera.Constants.FaceDetection.Classifications.all
            }
          />
          {image_CCCD && (
            <ImageBackground
              transparent={true}
              source={
                open == 'blue'
                  ? require('../../assets/images/uv2.png')
                  : require('../../assets/images/uv1.png')
              }
              style={{
                position: 'absolute',
                backgroundColor: 'transparent',
                height: Dimensions.get('window').height - 60,
                width: Dimensions.get('window').width,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 600,
                  width: Dimensions.get('window').width * 0.6,
                }}>
                {instruct}
              </Text>
              <View
                style={[
                  styles.circle,
                  {borderColor: open != 'blue' ? 'black' : '#00FF00'},
                ]}>
                <View />
              </View>
            </ImageBackground>
          )}
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              padding: 10,
              flexDirection: 'row',
              backgroundColor: 'rgba(0,0,0,1)',
              height: 60,
            }}>
            <View style={{width: '30%'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => set_open_camera_dectection(false)}>
                  <AntDesign
                    name="close"
                    size={23}
                    color="#ffffff"
                    style={{paddingLeft: 10, paddingRight: 10}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={{ width: '40%', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (!image_CCCD) {
                                        takePicture("CCCD.jpg", set_image_CCCD)
                                    }
                                    else {
                                        if (open == 'blue') {
                                            takePicture("Face.jpg", set_image_Face)
                                        }
                                    }
                                }}>
                                <View
                                    style={{
                                        borderWidth: 2,
                                        borderRadius: 40,
                                        borderColor: open === 'blue' ? 'white' : 'rgba(255,255,255,0.5)',
                                        height: 40,
                                        width: 40,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <View
                                        style={{
                                            borderWidth: 2,
                                            borderRadius: 40,
                                            borderColor: open === 'blue' ? 'white' : 'rgba(255,255,255,0.5)',
                                            height: 30,
                                            width: 30,
                                            backgroundColor: open === 'blue' ? 'white' : 'rgba(255,255,255,0.5)',
                                        }}></View>
                                </View>
                            </TouchableOpacity>
                        </View> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default App;

const styles = StyleSheet.create({
  circle: {
    marginTop: 30,
    height: 280,
    width: 194,
    borderRadius: 300,
    // borderWidth: 2,
    borderColor: 'black',
    // backgroundColor: 'transparent'
  },
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  camera: {
    flexGrow: 1,
    backgroundColor: 'blue',
  },
  bound: ({width, height, x, y, open}) => {
    return {
      position: 'absolute',
      top: y + 20,
      left: x - 20,
      height,
      width,
      borderWidth: 5,
      borderColor: open,
      zIndex: 3000,
    };
  },
  glasses: ({rightEyePosition, leftEyePosition, yawAngle, rollAngle}) => {
    return {
      position: 'absolute',
      top: rightEyePosition.y - 20,
      left: rightEyePosition.x - 60,
      resizeMode: 'contain',
      width: Math.abs(leftEyePosition.x - rightEyePosition.x) + 100,
    };
  },
});
