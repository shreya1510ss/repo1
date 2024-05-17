import React from 'react';
import {Stack} from '@chakra-ui/layout';
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";


const chatLoading = () => {
  return (
    <Stack>
      <Stack>
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
      </Stack>
    </Stack>
  );
}

export default chatLoading