import {Alert} from 'react-native';
import {PFColors, PFFontSize, PFFonts, appIcons, appImages} from '../exporter';
import {svgIcon} from '../../assets/svg';

export function showAlert(type: string, des: string, onPress?: () => void) {
  Alert.alert(type, des, [
    {
      onPress: onPress,
    },
  ]);
}

export const isProduction = false;

export const REQ_LIST_SOCKET_URL = isProduction
  ? 'wss://path-rover.com/cable?'
  : 'wss://staging.path-rover.com/cable?';
export const UNEXPECTED_ERROR = 'Something went wrong, Please try later.';
export const INVALID_COORDINATE_ERROR =
  'Not valid coordinates, Please try with correct coordinates.';
export const BASE_URL = isProduction
  ? 'https://path-rover.com/api/v1/'
  : 'https://staging.path-rover.com/api/v1/';
export const FAQ_LIST_LINK = isProduction
  ? 'https://path-rover.com/faq_list'
  : 'https://staging.path-rover.com/faq_list';
export const DOMAIN_BASE_URL = isProduction
  ? 'https://path-rover.com/'
  : 'https://staging.path-rover.com/';
export const mapBoxToken =
  'sk.eyJ1IjoibWF0YW9zbWFuIiwiYSI6ImNtMHhsejduczBkOGEycXBnbmh2NG5oaDcifQ.pPM1yQbjLKE-C0Mjg8mi0Q';
export const WEATHER_API_KEY = 'deaad5f174ef065c55f06d98b520e02c';
const TEST_KEY =
  'pk_test_51HCPWGDPRo9kCaKXRY8AILjgfyJhLlmkDUlsvsbU4SbGRZQ4jTBe4Boq4LiL9oHCq40mqRZSn7KRBn4A13RYtd7u00lAzNP0Dc';
const PRODUCTION_KEY = '';
export const STRIPE_KEY = isProduction ? PRODUCTION_KEY : TEST_KEY;
export const OPEN_AI_URL = 'https://api.openai.com/v1/';
export const OPEN_AI_KEY =
  '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';
export const AGORA_KEY = '7f325faacba441eabb5bfca254aef699';
export const CHAT_NON_VERIFIED_TEXT =
  "You need to create a chat account before proceeding. Please create one and try again.'";
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

export const OFFER_STATUS = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const APP_INTRO_SLIDES: IntroSlidesTypes[] = [
  {
    key: 1,
    title: 'Welcome to PathRover!',
    info: 'The premier navigation and mapping application tailored specifically for the oil and gas industry. Our app is designed to simplify navigation in remote and challenging environments, ensuring that you have the tools you need to reach your destination efficiently and safely.',
    image: appImages.appIntroTwo,
  },
  {
    key: 2,
    title: 'Create and Share Routes',
    info: 'Easily create routes and share them with your team for streamlined navigation. Whether you’re planning the best path to a new drill site or coordinating logistics for equipment delivery, PathRover has you covered.',
    image: appImages.appIntroOne,
  },
  {
    key: 3,
    title: 'Integrated Chat: Seamless Communication',
    info: 'Stay connected with your team no matter where you are with PathRover’s Integrated Chat, create group chats for different projects or teams, allowing for organized and efficient communication.',
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
export const APP_ROLE = {
  END_USER: 'endUser',
  DRIVER: 'driver',
  MANAGER: 'manager',
};
export const Default_Map_Style = 'mapbox://styles/mapbox/streets-v12';

export const MESSAGE_CONTAINS_LOCATION = 'messageContainsLocation';

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
  {title: 'End User', isSelected: true, id: 13, role: 'endUser'},
  {title: 'Manager', isSelected: false, id: 12, role: 'manager'},
  {title: 'Driver', isSelected: false, id: 1, role: 'driver'},
];
export const DurationArr = [
  {title: 'All', isSelected: true},
  {title: 'Week', isSelected: false},
  {title: ' Month', isSelected: false},
  {title: 'Year', isSelected: false},
];
export const OrderHistoryOptions = [
  {title: 'Total Ride', isSelected: true, status: 'all'},
  {title: ' Ride Completed', isSelected: false, status: 'completed'},
  {title: 'Cancelled', isSelected: false, status: 'cancelled'},
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

export const ManagerProfileMenu = [
  {
    id: 0,
    title: 'Payment History',
    icon: appIcons.car,
  },
  {
    id: 1,
    title: 'Manage Profile',
    icon: appIcons.settingIcon,
  },
  {
    id: 12,
    title: 'Payment Method',
    icon: appIcons.walletIcon,
  },
  {
    id: 11,
    title: 'Saved Library',
    icon: appIcons.bellIcon,
  },
  {
    id: 2,
    title: 'Notifications',
    icon: appIcons.bellIcon,
  },
  {
    id: 7,
    title: 'Privacy Policy',
    icon: appIcons.privacy,
  },
  {
    id: 6,
    title: 'Terms & Condition',
    icon: appIcons.terms,
  },
  {
    id: 4,
    title: 'Support',
    icon: appIcons.safety,
  },
  {
    id: 3,
    title: 'FAQ',
    icon: appIcons.faq,
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

export const EndUserProfileMenu = [
  {
    id: 10,
    title: 'Switch Account',
    icon: appIcons.logout,
  },
  {
    id: 1,
    title: 'Manage Profile',
    icon: appIcons.settingIcon,
  },
  {
    id: 11,
    title: 'Saved Library',
    icon: appIcons.bellIcon,
  },
  {
    id: 2,
    title: 'Notifications',
    icon: appIcons.bellIcon,
  },
  {
    id: 4,
    title: 'Support',
    icon: appIcons.safety,
  },
  {
    id: 3,
    title: "FAQ's",
    icon: appIcons.faq,
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
    id: 13,
    title: 'Unsubscribe',
    icon: appIcons.logout,
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
export const SafetyArr = [
  {id: 0, title: 'Ambulance', icon: svgIcon.BluePhone},
  {id: 1, title: 'Police', icon: svgIcon.BluePhone},
  {id: 2, title: 'Safety Tips', icon: svgIcon.Safety},
];
export const SafetytipsArr = [
  {id: 0, title: 'Safety tips for drivers'},
  {id: 1, title: 'Road Safety'},
  {id: 2, title: 'In App Safety Feature'},
];
export const MapTypes = [
  {
    id: 0,
    title: 'Terrain Map',
    icon: svgIcon.Terrain,
    type: 'mapbox://styles/mapbox/navigation-day-v1',
    isSelected: false,
    value: 'terrain',
  },
  {
    id: 2,
    title: 'Satellite Map',
    icon: svgIcon.Sattelite,
    type: 'mapbox://styles/mapbox/satellite-streets-v12',
    isSelected: false,
    value: 'satellite',
  },
  {
    id: 3,
    title: 'Default Map',
    icon: svgIcon.DefaultMarker,
    type: 'mapbox://styles/mapbox/streets-v12',
    isSelected: true,
    value: 'default',
  },
];
export const CancelReasons = [
  {
    id: 0,
    isSelected: false,
    title: 'I Changed my mind',
  },
  {
    id: 1,
    isSelected: false,
    title: 'The wait was too long',
  },
  {
    id: 2,
    isSelected: false,
    title: 'Driver asked to cancel',
  },
  {
    id: 3,
    isSelected: false,
    title: 'Driver is unable to contact',
  },
  {
    id: 4,
    isSelected: false,
    title: 'Driver  asked for extra money',
  },
  {
    id: 5,
    isSelected: false,
    title: 'Driver asked to cancel',
  },
];
export const RIDE_STATUS = {
  // ['i_am_here', 'start_ride', 'complete_ride', 'order_delivered']
  I_AM_HERE: 'i_am_here',
  START_RIDE: 'start_ride',
  COMPLETE_RIDE: 'complete_ride',
  ORDER_DELIVERED: 'order_delivered',
};

export const ANDROID_ADS = [
  'ca-app-pub-8139629720293753/3060338255',
  'ca-app-pub-8139629720293753/8121093246',
  'ca-app-pub-8139629720293753/5494929901',
  // 'ca-app-pub-8139629720293753/2868766563',
  // 'ca-app-pub-8139629720293753/2163781875',
  // 'ca-app-pub-8139629720293753/7929521557',
  // 'ca-app-pub-8139629720293753/9850700209',
  // 'ca-app-pub-8139629720293753/8537618532',
  // 'ca-app-pub-8139629720293753/7635600407',
  // 'ca-app-pub-8139629720293753/5911455198',
  // 'ca-app-pub-8139629720293753/8099205650',
  // 'ca-app-pub-8139629720293753/8099205650',
  // 'ca-app-pub-8139629720293753/5473042310',
  // 'ca-app-pub-8139629720293753/7737949860',
  // 'ca-app-pub-8139629720293753/5111786528',
  // 'ca-app-pub-8139629720293753/2485623181',
  // 'ca-app-pub-8139629720293753/1172541514',
  // 'ca-app-pub-8139629720293753/4595074911',
  // 'ca-app-pub-8139629720293753/1968911576',
  // 'ca-app-pub-8139629720293753/1523895301',
  // 'ca-app-pub-8139629720293753/7897731965',
  // 'ca-app-pub-8139629720293753/9655829902',
];

export const IOS_ADS = [
  'ca-app-pub-8139629720293753/9019241945',
  'ca-app-pub-8139629720293753/7879713807',
  'ca-app-pub-8139629720293753/9255803838',
  // 'ca-app-pub-8139629720293753/6649821792',
  // 'ca-app-pub-8139629720293753/7942722166',
  // 'ca-app-pub-8139629720293753/5253550468',
  // 'ca-app-pub-8139629720293753/2589564961',
  // 'ca-app-pub-8139629720293753/7650319959',
  // 'ca-app-pub-8139629720293753/9621043021',
  // 'ca-app-pub-8139629720293753/5024156612',
  // 'ca-app-pub-8139629720293753/3776817262',
  // 'ca-app-pub-8139629720293753/2463735594',
  // 'ca-app-pub-8139629720293753/4888425246',
  // 'ca-app-pub-8139629720293753/5145168432',
  // 'ca-app-pub-8139629720293753/3832086766',
  // 'ca-app-pub-8139629720293753/9001223784',
  // 'ca-app-pub-8139629720293753/4291822588',
  // 'ca-app-pub-8139629720293753/4291822588',
  // 'ca-app-pub-8139629720293753/8636098564',
  // 'ca-app-pub-8139629720293753/7688142118',
  // 'ca-app-pub-8139629720293753/7323016894',
];

export const top_ads_android = [
  'ca-app-pub-8139629720293753/3060338255',
  'ca-app-pub-8139629720293753/8121093246',
  'ca-app-pub-8139629720293753/5494929901',
  'ca-app-pub-8139629720293753/2868766563',
  'ca-app-pub-8139629720293753/2163781875',
  'ca-app-pub-8139629720293753/7929521557',
  'ca-app-pub-8139629720293753/9850700209',
  'ca-app-pub-8139629720293753/8537618532',
  'ca-app-pub-8139629720293753/7635600407',
  'ca-app-pub-8139629720293753/5911455198',
];

export const mid_ads_android = [
  'ca-app-pub-8139629720293753/8099205650',
  'ca-app-pub-8139629720293753/8099205650',
  'ca-app-pub-8139629720293753/5473042310',
  'ca-app-pub-8139629720293753/7737949860',
  'ca-app-pub-8139629720293753/5111786528',
  'ca-app-pub-8139629720293753/2485623181',
  'ca-app-pub-8139629720293753/1172541514',
  'ca-app-pub-8139629720293753/4595074911',
  'ca-app-pub-8139629720293753/1968911576',
  'ca-app-pub-8139629720293753/1523895301',
];

export const bottom_ads_android = [
  'ca-app-pub-8139629720293753/7897731965',
  'ca-app-pub-8139629720293753/9655829902',
];

export const top_ads_ios = [
  'ca-app-pub-8139629720293753/9019241945',
  'ca-app-pub-8139629720293753/7879713807',
  'ca-app-pub-8139629720293753/9255803838',
  'ca-app-pub-8139629720293753/6649821792',
  'ca-app-pub-8139629720293753/7942722166',
  'ca-app-pub-8139629720293753/5253550468',
  'ca-app-pub-8139629720293753/2589564961',
  'ca-app-pub-8139629720293753/7650319959',
  'ca-app-pub-8139629720293753/9621043021',
  'ca-app-pub-8139629720293753/5024156612',
];

export const mid_ads_ios = [
  'ca-app-pub-8139629720293753/3776817262',
  'ca-app-pub-8139629720293753/2463735594',
  'ca-app-pub-8139629720293753/4888425246',
  'ca-app-pub-8139629720293753/5145168432',
  'ca-app-pub-8139629720293753/3832086766',
  'ca-app-pub-8139629720293753/9001223784',
  'ca-app-pub-8139629720293753/4291822588',
  'ca-app-pub-8139629720293753/4291822588',
  'ca-app-pub-8139629720293753/8636098564',
  'ca-app-pub-8139629720293753/7688142118',
];

export const bottom_ads_ios = ['ca-app-pub-8139629720293753/7323016894'];

export const colorsArr = [
  {id: 1, color: '#3A424D', isSelected: false},
  {id: 2, color: '#6469E4', isSelected: false},
  {id: 3, color: '#43C8BF', isSelected: false},
  {id: 4, color: '#3AC4EE', isSelected: false},
  {id: 5, color: '#CF4727', isSelected: false},
  {id: 6, color: '#A47BF8', isSelected: false},
];
export const routeLineArr = [
  {id: 1, height: 8, isSelected: false},
  {id: 2, height: 6, isSelected: false},
  {id: 3, height: 4, isSelected: false},
];
export const EndUserSetting = [
  {
    id: 1,
    title: 'Custom Routes',
    icon: svgIcon.RouteBlue,
    type: 'custom_route',
  },
  {
    id: 2,
    title: 'Recordings',
    icon: svgIcon.RecordingIcon,
    type: 'recording_route',
  },
  {
    id: 3,
    title: 'Well Location Pins',
    icon: svgIcon.BluePin,
    type: 'maps_location_pins',
  },
  {
    id: 1,
    title: 'WayPoint',
    icon: svgIcon.RouteBlue,
    type: 'waypoint_route',
  },
];

// export const top_ads_android = [
//   'ca-app-pub-8139629720293753/3947982314',
//   'ca-app-pub-8139629720293753/6812156673',
//   'ca-app-pub-8139629720293753/4151162297',
//   'ca-app-pub-8139629720293753/4521869401',
//   'ca-app-pub-8139629720293753/1683953071',
//   'ca-app-pub-8139629720293753/9370871406',
//   'ca-app-pub-8139629720293753/1245797350',
//   'ca-app-pub-8139629720293753/8057789735',
//   'ca-app-pub-8139629720293753/2838080624',
//   'ca-app-pub-8139629720293753/5499075003',
// ];

// export const mid_ads_android = [
//   'ca-app-pub-8139629720293753/7328459166',
//   'ca-app-pub-8139629720293753/4810107030',
//   'ca-app-pub-8139629720293753/5633896245',
//   'ca-app-pub-8139629720293753/1777314235',
//   'ca-app-pub-8139629720293753/6838069227',
//   'ca-app-pub-8139629720293753/1612263900',
//   'ca-app-pub-8139629720293753/9763050812',
//   'ca-app-pub-8139629720293753/1694651232',
//   'ca-app-pub-8139629720293753/8449969143',
//   'ca-app-pub-8139629720293753/1992372002',
// ];

// export const bottom_ads_android = [
//   'ca-app-pub-8139629720293753/9164285019',
//   'ca-app-pub-8139629720293753/6374470145',
//   'ca-app-pub-8139629720293753/6482846007',
//   'ca-app-pub-8139629720293753/4012858660',
//   'ca-app-pub-8139629720293753/5552343069',
//   'ca-app-pub-8139629720293753/2267704176',
//   'ca-app-pub-8139629720293753/5716559248',
//   'ca-app-pub-8139629720293753/5134368649',
//   'ca-app-pub-8139629720293753/6946977919',
//   'ca-app-pub-8139629720293753/2763092840',
// ];

// export const top_ads_ios = [
//   'ca-app-pub-8139629720293753/1294631339',
//   'ca-app-pub-8139629720293753/2693944117',
//   'ca-app-pub-8139629720293753/8981549669',
//   'ca-app-pub-8139629720293753/4881957909',
//   'ca-app-pub-8139629720293753/3568876232',
//   'ca-app-pub-8139629720293753/3568876232',
//   'ca-app-pub-8139629720293753/3453890810',
//   'ca-app-pub-8139629720293753/4488034211',
//   'ca-app-pub-8139629720293753/6016738302',
//   'ca-app-pub-8139629720293753/8629631225',
//   'ca-app-pub-8139629720293753/1082878349',
// ];
// export const mid_ads_ios = [
//   'ca-app-pub-8139629720293753/5005548158',
//   'ca-app-pub-8139629720293753/9599399283',
//   'ca-app-pub-8139629720293753/6674417692',
//   'ca-app-pub-8139629720293753/3500894799',
//   'ca-app-pub-8139629720293753/1505286847',
//   'ca-app-pub-8139629720293753/4622404776',
//   'ca-app-pub-8139629720293753/7879123504',
//   'ca-app-pub-8139629720293753/9683159765',
//   'ca-app-pub-8139629720293753/8370078099',
//   'ca-app-pub-8139629720293753/8370078099',
// ];

// export const bottom_ads_ios = [
//   'ca-app-pub-8139629720293753/1751401683',
//   'ca-app-pub-8139629720293753/5032735799',
//   'ca-app-pub-8139629720293753/9438320019',
//   'ca-app-pub-8139629720293753/5623198089',
//   'ca-app-pub-8139629720293753/5005649780',
//   'ca-app-pub-8139629720293753/3692568119',
//   'ca-app-pub-8139629720293753/9774196083',
//   'ca-app-pub-8139629720293753/2406572455',
//   'ca-app-pub-8139629720293753/2997034745',
//   'ca-app-pub-8139629720293753/8461114412',
// ];

export const REPORTS_LIST = [
  {
    id: 1,
    name: 'Crash',
    icon: appIcons.accident,
    key: 'crash',
  },
  {
    id: 2,
    name: 'Slowdown',
    icon: appIcons.slowdown,
    key: 'slow_down',
  },
  {
    id: 1,
    name: 'Police',
    icon: appIcons.police,
    key: 'police',
  },
  {
    id: 1,
    name: 'Construction',
    icon: appIcons.workInProgress,
    key: 'construction',
  },
  {
    id: 1,
    name: 'Lane closure',
    icon: appIcons.laneClosure,
    key: 'lane_closure',
  },
  {
    id: 1,
    name: 'Object on road',
    icon: appIcons.object,
    key: 'object_on_road',
  },
  {
    id: 1,
    name: 'Stalled vehicle',
    icon: appIcons.warning,
    key: 'stalled_vehicle',
  },
];

export const HIKING_FILTERS_CHECKLIST = [
  {
    id: 1,
    label: 'Wet weather friendly',
  },
  {
    id: 2,
    label: 'Family friendly',
  },
  {
    id: 1,
    label: 'Alpine trail',
  },
  {
    id: 1,
    label: 'Hide closed',
  },
];

export const DIRECTIONS = [
  {
    id: 0,
    value: 'Downhill Only',
    label: 'Downhill Only',
  },
  {
    id: 1,
    value: 'Downhill Primary',
    label: 'Downhill Primary',
  },
  {
    id: 2,
    value: 'Both Directions',
    label: 'Both Directions',
  },
  {
    id: 3,
    value: 'Uphill Primary',
    label: 'Uphill Primary',
  },
  {
    id: 4,
    value: 'Uphill Only',
    label: 'Uphill Only',
  },
  {
    id: 5,
    value: 'One Direction',
    label: 'One Direction',
  },
];

export const DIFFICULTIES = [
  {
    id: 0,
    value: 'Access Road/Trail',
    label: 'Access Road/Trail',
  },
  {
    id: 1,
    value: 'Secondary Access Road/Trail',
    label: 'Secondary Access Road/Trail',
  },
  {
    id: 2,
    value: 'White',
    label: 'White',
  },
  {
    id: 3,
    value: 'Green',
    label: 'Green',
  },
  {
    id: 4,
    value: 'Blue',
    label: 'Blue',
  },
  {
    id: 5,
    value: 'Advanced',
    label: 'Advanced',
  },
  {
    id: 6,
    value: 'Black',
    label: 'Black',
  },
  {
    id: 7,
    value: 'Double Black Diamond',
    label: 'Double Black Diamond',
  },
  {
    id: 8,
    value: 'Proline',
    label: 'Proline',
  },
  {
    id: 8,
    value: 'Lift',
    label: 'Lift',
  },
];

export const TTFs = [
  {
    id: 0,
    value: 'A-Frame',
    label: 'A-Frame',
  },
  {
    id: 1,
    value: 'Berm',
    label: 'Berm',
  },
  {
    id: 2,
    value: 'Bridge',
    label: 'Bridge',
  },
  {
    id: 3,
    value: 'Drop',
    label: 'Drop',
  },
  {
    id: 4,
    value: 'Jump',
    label: 'Jump',
  },
  {
    id: 5,
    value: 'Gap Jump',
    label: 'Gap Jump',
  },
  {
    id: 6,
    value: 'Ladder Bridge',
    label: 'Ladder Bridge',
  },
  {
    id: 7,
    value: 'Log Ride',
    label: 'Log Ride',
  },
  {
    id: 8,
    value: 'Pump Track',
    label: 'Pump Track',
  },
  {
    id: 9,
    value: 'Rock Face',
    label: 'Rock Face',
  },
  {
    id: 10,
    value: 'Rock Garden',
    label: 'Rock Garden',
  },
  {
    id: 11,
    value: 'Roller Coaster',
    label: 'Roller Coaster',
  },
  {
    id: 12,
    value: 'Skinny',
    label: 'Skinny',
  },
  {
    id: 13,
    value: 'Teeter Totter',
    label: 'Teeter Totter',
  },
  {
    id: 14,
    value: 'Wallride',
    label: 'Wallride',
  },
  {
    id: 15,
    value: 'Other',
    label: 'Other',
  },
];

export const BIKE_TYPE = [
  {
    id: 0,
    value: 'Downhill',
    label: 'Downhill',
  },
  {
    id: 1,
    value: 'All-Mountain',
    label: 'All-Mountain',
  },
  {
    id: 2,
    value: 'Cross-Country',
    label: 'Cross-Country',
  },
  {
    id: 3,
    value: 'Dirtjump/Slopstyle',
    label: 'Dirtjump/Slopstyle',
  },
  {
    id: 4,
    value: 'Road',
    label: 'Road',
  },
  {
    id: 5,
    value: 'Fat Bike',
    label: 'Fat Bike',
  },
  {
    id: 6,
    value: 'Adaptive MTB',
    label: 'Adaptive MTB',
  },
  {
    id: 7,
    value: 'Cyclo-Cross',
    label: 'Cyclo-Cross',
  },
  {
    id: 8,
    value: 'Gravel/Adventure',
    label: 'Gravel/Adventure',
  },
  {
    id: 9,
    value: 'Unicycle',
    label: 'Unicycle',
  },
  {
    id: 10,
    value: 'BMX',
    label: 'BMX',
  },
  {
    id: 11,
    value: 'Trials',
    label: 'Trials',
  },
];

export const TRAIL_TYPE = [
  {
    id: 0,
    label: 'Hiking Trails',
    value: 'hiking',
  }, // General hiking/walking trails
  // {id: 1, label: 'Footway', value: 'footway'}, // Sidewalks, pedestrian paths
  // {id: 2, label: 'Steps', value: 'steps'}, // Stairways and pedestrian-only step paths
  {id: 3, label: 'Ski Trails', value: 'skiing'}, // Ski routes (piste:type)
  {id: 4, label: 'Mountain Biking Trails', value: 'mtb'}, // MTB-specific routes
  {id: 5, label: 'Cycling Paths', value: 'cycleway'}, // Bicycle lanes, tracks
  {id: 6, label: 'Bridleways (Horse Riding)', value: 'bridleway'}, // Horse-riding trails
  {id: 7, label: 'Off-Road Trails', value: 'track'}, // Dirt roads, forestry tracks
];
export const TRAIL_TYPE1 = [
  {
    id: 0,
    value: 'Singletrack',
    label: 'Singletrack',
  },
  {
    id: 1,
    value: 'Machine Groomed',
    label: 'Machine Groomed',
  },
  {
    id: 2,
    value: 'Doubletrack',
    label: 'Doubletrack',
  },
  {
    id: 3,
    value: 'Mixed',
    label: 'Mixed',
  },
  {
    id: 4,
    value: 'Dirt/Gravel Road',
    label: 'Dirt/Gravel Road',
  },
  {
    id: 5,
    value: 'Asphalt/Tarmac Road',
    label: 'Asphalt/Tarmac Road',
  },
  {
    id: 6,
    value: 'Paved Path',
    label: 'Paved Path',
  },
  {
    id: 7,
    value: 'Gravel Path',
    label: 'Gravel Path',
  },
  {
    id: 8,
    value: 'Rail Trail',
    label: 'Rail Trail',
  },
  {
    id: 9,
    value: 'Wilderness Trail',
    label: 'Wilderness Trail',
  },
  {
    id: 10,
    value: 'Hike-a-Bike',
    label: 'Hike-a-Bike',
  },
  {
    id: 11,
    value: 'Primitive',
    label: 'Primitive',
  },
  {
    id: 12,
    value: 'Grass',
    label: 'Grass',
  },
  {
    id: 13,
    value: 'Boardwalk',
    label: 'Boardwalk',
  },
  {
    id: 14,
    value: 'Sandy',
    label: 'Sandy',
  },
  {
    id: 15,
    value: 'Ski Run (Piste)',
    label: 'Ski Run (Piste)',
  },
  {
    id: 16,
    value: 'Ski Run (Off-Piste)',
    label: 'Ski Run (Off-Piste)',
  },
  {
    id: 17,
    value: 'Other',
    label: 'Other',
  },
];

export const NEW_TRAILS = [
  {
    id: 0,
    value: '1 Month',
    label: '1 Month',
  },
  {
    id: 1,
    value: '6 months',
    label: '6 months',
  },
  {
    id: 2,
    value: '12 months',
    label: '12 months',
  },
];

export const LOCAL_POPULARITY = [
  {
    id: 0,
    value: '10',
    label: '10',
  },
  {
    id: 1,
    value: '20',
    label: '20',
  },
  {
    id: 2,
    value: '30',
    label: '30',
  },
  {
    id: 3,
    value: '40',
    label: '40',
  },
  {
    id: 4,
    value: '50',
    label: '50',
  },
  {
    id: 5,
    value: '60',
    label: '60',
  },
  {
    id: 6,
    value: '70',
    label: '70',
  },
  {
    id: 7,
    value: '80',
    label: '80',
  },
  {
    id: 8,
    value: '90',
    label: '90',
  },
];

export const TRAILS_COMPLETION = [
  {
    id: 0,
    value: 'Completed',
    label: 'Completed',
  },
  {
    id: 1,
    value: 'Not Completed',
    label: 'Not Completed',
  },
];

export const TRAILS_ON_WHISHLIST = [
  {
    id: 0,
    value: 'Yes',
    label: 'Yes',
  },
  {
    id: 1,
    value: 'No',
    label: 'No',
  },
];

export const UNSANCTIONED = [
  {
    id: 0,
    value: 'No',
    label: 'No',
  },
  {
    id: 1,
    value: 'Yes',
    label: 'Yes',
  },
];
export const SubscriptionPackageName = 'com.pathrover.monthly';
export const ROUTE_LINE_STYLES = {
  lineWidth: 8,
  opacity: 0.7,
  color: '#0C36FE',
};

export const stateCodeMap: Record<string, string> = {
  Kansas: 'KS',
  California: 'CA',
  Saskatchewan: 'SK',
  Oregon: 'OR',
  Alberta: 'AB',
  'North Dakota': 'ND',
  Texas: 'TX',
  Nevada: 'NV',
  Ohio: 'OH',
  Kentucky: 'KY',
  Manitoba: 'MB',
  'New York': 'NY',
  'Atlantic Region': 'Atlantic',
  'New Mexico': 'NM',
  Indiana: 'IN',
  'Gulf of Mexico': 'GoM',
  Mississippi: 'MS',
  'British Columbia': 'BC',
  'West Virginia': 'WV',
  Nebraska: 'NE',
  Florida: 'FL',
  Missouri: 'MO',
  Arkansas: 'AR',
  'South Dakota': 'SD',
  Oklahoma: 'OK',
  Idaho: 'ID',
  Pennsylvania: 'PA',
  Alaska: 'AK',
  Yukon: 'YT',
  Louisiana: 'LA',
  Wyoming: 'WY',
  Montana: 'MT',
  Illinois: 'IL',
  Tennessee: 'TN',
  Washington: 'WA',
  Michigan: 'MI',
  Alabama: 'AL',
  Utah: 'UT',
  Ontario: 'ON',
  Colorado: 'CO',
  Virginia: 'VA',
};
