import { Platform } from 'react-native';
import { getAvailablePurchases, getReceiptIOS, validateReceiptIos } from 'react-native-iap';

export async function isSubscriptionActive() {
    try {
        if (Platform.OS === 'ios') {
            const availablePurchases = await getAvailablePurchases();

            const sortedAvailablePurchases = availablePurchases.sort(
                (a, b) => b.transactionDate - a.transactionDate,
            );

            const latestAvailableReceipt =
                sortedAvailablePurchases?.[0]?.transactionReceipt;

            const latestReceipt = await getReceiptIOS({ forceRefresh: false });

            const isTestEnvironment = __DEV__;

            const decodedReceipt = await validateReceiptIos({
                receiptBody: {
                    'receipt-data': latestReceipt,
                    password: 'a8579a60ab404e478988a45bee6d9ed1',
                },
                isTest: true,
            });

            //TODO: CHANGE IT BEFORE PRODUCTION
            // }, isTest: isTestEnvironment,

            const { latest_receipt_info } = decodedReceipt;            

            const isSubValid = !!latest_receipt_info?.find(receipt => {
                const expirationInMilliseconds = Number(receipt?.expires_date_ms);
                const nowInMilliseconds = Date?.now();
                return expirationInMilliseconds > nowInMilliseconds;
            });

            const check = {
                validation: isSubValid,
                receipt: availablePurchases[0],
            };
            return check;
        }

        if (Platform.OS === 'android') {
            const availablePurchases = await getAvailablePurchases();

            let check;
            if (availablePurchases?.length > 0) {
                for (let i = 0; i < availablePurchases.length; i++) {
                    if (
                        availablePurchases[i].productId &&
                        availablePurchases[i].autoRenewingAndroid
                    ) {
                        check = {
                            validation: true,
                            receipt: availablePurchases[i],
                        };
                    }
                }
            } else {
                check = { validation: false }
            }
            return check;
        }
    } catch (error) {
        console.error('error', error);
        return { validation: false };
    }
}
