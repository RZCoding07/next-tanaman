import React from 'react';

// Admin Imports

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from 'react-icons/md';

import {
  FaUsers
} from 'react-icons/fa6';

import { FaTreeCity } from "react-icons/fa6";

import { PiTreePalmFill } from "react-icons/pi";

import { BsFileEarmarkBarGraph } from "react-icons/bs";

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Data Users',
    layout: '/admin',
    icon: <FaUsers className="h-6 w-6" />,
    path: 'users',
  },
  {
    name: 'Data Regional',
    layout: '/admin',
    icon: <FaTreeCity className="h-6 w-6" />,
    path: 'regional',
  },
  {
    name: 'Data Kebun',
    layout: '/admin',
    icon: <PiTreePalmFill className="h-6 w-6" />,
    path: 'kebun',
  },
  {
    name: 'Data Kuadran',
    layout: '/admin',
    path: 'kuadran',
    icon: <BsFileEarmarkBarGraph className="h-6 w-6" />,
  }

];
export default routes;
