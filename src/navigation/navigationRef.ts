// navigationUtils.js
import { createRef } from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = createRef();
export const isReadyRef = createRef(); // Add this line

export function navigate(name, params) {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current.navigate(name, params);
    } else {
        console.warn('Navigation not ready yet');
        // Optionally queue navigation for later
    }
}

export function replace(name, params) {
    try {
        console.log('🚀 Attempting to replace screen:', name);

        if (isReadyRef.current && navigationRef.current) {
            navigationRef.current.dispatch(StackActions.replace(name, params));
        } else {
            console.warn('Navigation not ready for replace');
        }
    } catch (error) {
        console.error('❌ Navigation error:', error);
    }
}

export function goBack() {
    if (isReadyRef.current && navigationRef.current) {
        navigationRef.current.goBack();
    }
}

// import { createRef } from 'react';
// import { StackActions } from '@react-navigation/native';

// export const navigationRef = createRef();

// // Helper function to navigate
// export function navigate(name, params) {
//     if (navigationRef.current) {
//         navigationRef.current.navigate(name, params);
//     }
// }

// // Helper function to replace screen
// export function replace(name, params) {
//     try {
//         console.log('🚀 Replacing screen:', name, params, navigationRef);
        
//         if (navigationRef.current) {
//             navigationRef.current.dispatch(StackActions.replace(name, params));
//         }
//     } catch (error) {
//       console.log('❌ Error:', error);
//     }
// }

// // Helper function to go back
// export function goBack() {
//     if (navigationRef.current) {
//         navigationRef.current.goBack();
//     }
// }