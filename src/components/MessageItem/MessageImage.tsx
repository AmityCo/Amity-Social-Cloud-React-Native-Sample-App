import { View } from 'react-native';
import ExpoFastImage from 'expo-fast-image';
import { observeFile } from '@amityco/ts-sdk';
import Lightbox from 'react-native-lightbox-v2';
import React, { VFC, useState, useEffect, memo } from 'react';

import { messageImageStyles } from './styles';

const MessageImage: VFC<{ message: Amity.Message }> = ({ message }) => {
  const [image, setImage] = useState<Amity.File>();

  useEffect(() => observeFile(message.fileId, fileObj => setImage(fileObj.data)), [message]);

  return (
    <View style={messageImageStyles.container}>
      {image?.fileUrl && (
        <Lightbox
          activeProps={{
            style: messageImageStyles.imageActive,
          }}
        >
          <ExpoFastImage
            uri={`${image.fileUrl}?size=medium`}
            style={messageImageStyles.image}
            cacheKey={message.fileId}
          />
        </Lightbox>
      )}
    </View>
  );
};

export default memo(MessageImage);
