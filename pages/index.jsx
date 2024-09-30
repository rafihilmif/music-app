import Navbar from '@/components/user/Navbar';
import Player from '@/components/user/fans/Player';
import Sidebar from '@/components/user/fans/Sidebar';
import { PlayerContext } from '@/context/PlayerContext';
import { React, useContext } from 'react';

import { useEffect, useState } from 'react';

export default function index({ children }) {
  const { audioRef } = useContext(PlayerContext);
  return <></>;
}
