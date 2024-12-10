import {Alert} from 'react-native';
import {PFColors, PFFontSize, PFFonts, appIcons, appImages} from '../exporter';
import {svgIcon} from '../../assets/svg';

export function showAlert(type: string, des: string) {
  Alert.alert(type, des);
}
export const UNEXPECTED_ERROR = 'something went wrong, Please try later.';
export const BASE_URL = 'https://staging.pathfinder-app.com/api/v1/';

type IntroSlidesTypes = {
  key: number;
  title: string;
  info: string;
  image: any;
};
type ImageOptionTypes = {
  mediaType: string;
  includeBase64: boolean;
};
export const IMAGE_OPTIONS: ImageOptionTypes = {
  mediaType: 'photo',
  includeBase64: false,
};
type VehicleTypes = {
  key: number;
  title: string;
  icon: any;
};

export const APP_INTRO_SLIDES: IntroSlidesTypes[] = [
  {
    key: 1,
    title: 'Welcome to PathFinder!',
    info: 'The premier navigation and mapping application tailored specifically for the oil and gas industry. Our app is designed to simplify navigation in remote and challenging environments, ensuring that you have the tools you need to reach your destination efficiently and safely.',
    image: appImages.appIntroTwo,
  },
  {
    key: 2,
    title: 'Create and Share Routes',
    info: 'Easily create routes and share them with your team for streamlined navigation. Whether you’re planning the best path to a new drill site or coordinating logistics for equipment delivery, PathFinder has you covered.',
    image: appImages.appIntroOne,
  },
  {
    key: 3,
    title: 'Integrated Chat: Seamless Communication',
    info: 'Stay connected with your team no matter where you are with PathFinder’s Integrated Chat, create group chats for different projects or teams, allowing for organized and efficient communication.',
    image: appImages.appIntroThree,
  },
];
export const AuthSheetLoginObj = {
  headerTitle: 'Login',
  btnEmailText: 'Login With Email',
  btnPhoneText: 'Login With Phone',
  isLogin: true,
};
export const AuthSheetSignupObj = {
  headerTitle: 'Create new account',
  btnEmailText: 'Signup With Email',
  btnPhoneText: 'Signup With Phone',
  isLogin: false,
};
export const LOGIN_TYPE_TEXT = {
  EMAIL: 'email address',
  PHONE: 'phone number',
};

export const VehicleTypes: VehicleTypes[] = [
  {
    key: 1,
    title: 'Pick Up Truck',
    icon: svgIcon.PickupTruck,
  },
  {
    key: 2,
    title: 'Semi Trucks',
    icon: svgIcon.SemiTruck,
  },
  {
    key: 3,
    title: 'Trailers',
    icon: svgIcon.Trailer,
  },
];

export const TrailerLoadingCapacity = [
  {
    id: 1,
    title: 'Flatbed Trailer',
    description: 'Enclosed trailer used for transporting general freight.',
    weightCapacity: 'Approximately 45,000 pounds',
    standardLengths: ['28 feet', '45 feet', '48 feet', '53 feet'],
    isWeightSelected: false,
  },
  {
    id: 2,
    title: 'Dry Van Trailer',
    description:
      'Trailer that connects to a ball hitch in the bed of a pickup truck, providing more stability.',
    weightCapacity: 'Approximately 30,000 pounds',
    standardLengths: ['20 feet', '24 feet', '28 feet', '32 feet', '40 feet'],
    isWeightSelected: false,
  },
  {
    id: 3,
    title: 'Refrigerated Trailer (Reefer)',
    description:
      'Enclosed trailer with temperature control for perishable goods.',
    weightCapacity: 'Approximately 43,000 pounds',
    standardLengths: ['28 feet', '45 feet', '48 feet', '53 feet'],
    isWeightSelected: false,
  },
  {
    id: 4,
    title: 'Dump Trailer',
    description:
      'Trailer with a hydraulic lift used for transporting loose materials like sand, gravel, or demolition waste.',
    weightCapacity: 'Approximately 25,000 to 30,000 pounds',
    standardLengths: ['20 feet', '24 feet', '30 feet', '36 feet', '40 feet'],
    isWeightSelected: false,
  },
  {
    id: 5,
    title: 'Lowboy Trailer',
    description:
      'Trailer with a low deck height used for transporting heavy equipment.',
    weightCapacity:
      'Approximately 40,000 to 80,000 pounds (depending on the number of axles)',
    standardLengths: ['24 feet', '40 feet', '48 feet', '53 feet'],
    isWeightSelected: false,
  },
  {
    id: 6,
    title: 'Tanker Trailer',
    description: 'Trailer designed for transporting liquids or gases.',
    weightCapacity:
      'Approximately 50,000 pounds (depending on the type of liquid or gas and trailer specifications)',
    standardLengths: ['40 feet', '42 feet', '43 feet', '48 feet', '53 feet'],
    isWeightSelected: false,
  },
  {
    id: 7,
    title: 'Step Deck Trailer (Drop Deck)',
    description:
      'Trailer with a lower deck height, allowing for taller loads than a flatbed.',
    weightCapacity: 'Approximately 48,000 pounds',
    standardLengths: ['40 feet', '45 feet', '48 feet', '53 feet'],
    isWeightSelected: false,
  },
  {
    id: 8,
    title: 'Car Carrier Trailer',
    description: 'Trailer designed for transporting cars.',
    weightCapacity:
      'Approximately 40,000 pounds (typically can carry 7-9 cars)',
    standardLengths: [
      '45 feet',
      '48 feet',
      '53 feet',
      '80 feet (double-deck trailers)',
    ],
    isWeightSelected: false,
  },
  {
    id: 9,
    title: 'Livestock Trailer',
    description: 'Trailer designed for transporting animals.',
    weightCapacity:
      'Approximately 20,000 to 30,000 pounds (depending on the type and number of animals)',
    standardLengths: [
      '20 feet',
      '24 feet',
      '28 feet',
      '32 feet',
      '40 feet',
      '50 feet',
      '53 feet',
    ],
    isWeightSelected: false,
  },
];

export const SemiTruckData = [
  {
    id: 1,
    title: 'Medium Duty',
    isWeightSelected: false,
    model: [
      {
        id: 2,
        title: 'Freightliner M2 106',
        isModelSelected: false,
        capacity: '26,001 to 33,000 pounds',
      },
      {
        id: 3,
        title: 'International MV Series',
        isModelSelected: false,
        capacity: '26,001 to 33,000 pounds',
      },
      {
        id: 4,
        title: 'Kenworth T370',
        isModelSelected: false,
        capacity: '26,001 to 33,000 pounds',
      },
    ],
  },
  {
    id: 5,
    title: 'Heavy Duty',
    isWeightSelected: false,
    model: [
      {
        id: 6,
        title: 'Freightliner Cascadia',
        isModelSelected: false,
        capacity: 'Over 33,000 pounds',
      },
      {
        id: 7,
        title: 'Volvo VNL Series',
        isModelSelected: false,
        capacity: 'Over 33,000 pounds',
      },
      {
        id: 8,
        title: 'Kenworth T680',
        isModelSelected: false,
        capacity: 'Over 33,000 pounds',
      },
      {
        id: 9,
        title: 'Peterbilt 579',
        isModelSelected: false,
        capacity: 'Over 33,000 pounds',
      },
    ],
  },
];
export const CompanyTypes = [
  {
    id: 1,
    title: 'Single Member Company',
    isSelected: false,
  },
  {
    id: 2,
    title: 'Private Limited Company',
    isSelected: false,
  },
  {
    id: 3,
    title: 'Public Limited Company',
    isSelected: false,
  },
];

export const PickupTruck = [
  {
    id: 1,
    title: '1/2 Ton Pickup Trucks',
    isWeightSelected: false,
    model: [
      {
        id: 2,
        title: 'Ford F-150',
        isModelSelected: false,
        capacity: 'Approximately 5,300 to 6,200 pounds',
      },
      {
        id: 3,
        title: 'Chevrolet Silverado 1500',
        isModelSelected: false,
        capacity: 'Approximately 5,300 to 6,200 pounds',
      },
      {
        id: 4,
        title: 'Ram 1500',
        isModelSelected: false,
        capacity: 'Approximately 5,300 to 6,200 pounds',
      },
      {
        id: 5,
        title: 'GMC Sierra 1500',
        isModelSelected: false,
        capacity: 'Approximately 5,300 to 6,200 pounds',
      },
    ],
  },
  {
    id: 6,
    title: '3/4 Ton Pickup Trucks',
    isWeightSelected: false,
    model: [
      {
        id: 7,
        title: 'Ford F-250',
        isModelSelected: false,
        capacity: 'Approximately 3,000 to 4,000 pounds',
      },
      {
        id: 8,
        title: 'Chevrolet Silverado 2500',
        isModelSelected: false,
        capacity: 'Approximately 3,000 to 4,000 pounds',
      },
      {
        id: 9,
        title: 'Ram 2500',
        isModelSelected: false,
        capacity: 'Approximately 3,000 to 4,000 pounds',
      },
      {
        id: 10,
        title: 'GMC Sierra 2500',
        isModelSelected: false,
        capacity: 'Approximately 3,000 to 4,000 pounds',
      },
    ],
  },
  {
    id: 11,
    title: '1 Ton Pickup Trucks',
    isWeightSelected: false,
    model: [
      {
        id: 12,
        title: 'Ford F-350',
        isModelSelected: false,
        capacity: 'Approximately 4,000 to 7,000 pounds',
      },
      {
        id: 13,
        title: 'Chevrolet Silverado 3500',
        isModelSelected: false,
        capacity: 'Approximately 4,000 to 7,000 pounds',
      },
      {
        id: 14,
        title: 'Ram 3500',
        isModelSelected: false,
        capacity: 'Approximately 4,000 to 7,000 pounds',
      },
      {
        id: 15,
        title: 'GMC Sierra 3500',
        isModelSelected: false,
        capacity: 'Approximately 4,000 to 7,000 pounds',
      },
    ],
  },
  {
    id: 16,
    title: 'Trucks Larger Than 1 Ton',
    isWeightSelected: false,
    model: [
      {
        id: 17,
        title: 'Ford F-450',
        isModelSelected: false,
        capacity: 'Approximately 5,300 to 6,200 pounds',
      },
      {
        id: 18,
        title: 'Ford F-550',
        isModelSelected: false,
        capacity:
          'Approximately 6,000 to 12,000 pounds (depending on configuration)',
      },
      {
        id: 19,
        title: 'Ford F-650',
        isModelSelected: false,
        capacity:
          'Approximately 8,000 to 14,000 pounds (depending on configuration)',
      },
      {
        id: 20,
        title: 'Ford F-750',
        isModelSelected: false,
        capacity:
          'Approximately 12,000 to 20,000 pounds (depending on configuration)',
      },
      {
        id: 21,
        title: 'Chevrolet Silverado 4500',
        isModelSelected: false,
        capacity: 'Approximately 7,500 to 8,000 pounds',
      },
      {
        id: 22,
        title: 'Chevrolet Silverado 5500',
        isModelSelected: false,
        capacity:
          'Approximately 9,000 to 12,000 pounds (depending on configuration)',
      },
      {
        id: 23,
        title: 'Chevrolet Silverado 6500',
        isModelSelected: false,
        capacity:
          'Approximately 12,000 to 14,000 pounds (depending on configuration)',
      },
      {
        id: 24,
        title: 'Ram 4500',
        isModelSelected: false,
        capacity: 'Approximately 6,000 to 8,000 pounds',
      },
      {
        id: 25,
        title: 'Ram 5500',
        isModelSelected: false,
        capacity:
          'Approximately 8,000 to 12,000 pounds (depending on configuration)',
      },
    ],
  },
];

export const USER_PROFILE = [
  // { title: "Manager", isSelected: false, id: 12, role: "manager" },
  {title: 'Driver', isSelected: false, id: 1, role: 'driver'},
];
export const DurationArr = [
  {title: 'Week', isSelected: true},
  {title: ' Month', isSelected: false},
  {title: 'Year', isSelected: false},
];
export const OrderHistoryOptions = [
  {title: 'Total Ride', isSelected: true},
  {title: ' Ride Completed', isSelected: false},
  {title: 'Cancelled', isSelected: false},
];
export const DriverProfileMenu = [
  {
    id: 0,
    title: 'Vehicle Registration',
    icon: appIcons.car,
  },
  {
    id: 1,
    title: 'Manage Profile',
    icon: appIcons.settingIcon,
  },
  {
    id: 2,
    title: 'Notifications',
    icon: appIcons.bellIcon,
  },
  {
    id: 3,
    title: "FAQ's",
    icon: appIcons.faq,
  },
  {
    id: 4,
    title: 'Support',
    icon: appIcons.safety,
  },
  {
    id: 5,
    title: 'Safety',
    icon: appIcons.safety,
  },
  {
    id: 6,
    title: 'Terms & Condition',
    icon: appIcons.terms,
  },
  {
    id: 7,
    title: 'Privacy Policy',
    icon: appIcons.privacy,
  },
  {
    id: 8,
    title: 'Logout',
    icon: appIcons.logout,
  },

  {
    id: 9,
    title: 'Delete',
    icon: appIcons.logout,
  },
  {
    id: 10,
    title: 'Switch Account',
    icon: appIcons.logout,
  },
];
export const ManageProfileArr = [
  {
    id: 0,
    title: 'Name',
  },
  {
    id: 1,
    title: 'Email',
  },
  {
    id: 2,
    title: 'Password',
  },
  {
    id: 3,
    title: 'Phone Number',
  },
];

