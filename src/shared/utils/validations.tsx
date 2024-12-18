import * as yup from 'yup';

export const loginInitialObj = {
    email: "",
    password: "",
    phone: ""
}
export const signupInitialObject = {
    email: "",
    name: "",
    phone: "",
    firstName: "",
    lastName: ""
}
export const signupPasswordObj = {
    password: "",
    confirmPassword: ""
}
export const EditInitialObject = {
    email: "",
    name: "",
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
}
export const forgotPasswordInitialObject = {
    email: "",
    phone: ""
}
export const supportInitialObj = {
    email: "",
    firstName: "",
    lastName: "",
    message: ""
}

export const resetUsernameInitialObject = {
    username: "",
    confirmUsername: "",
}
export const resetPasswordInitial = {
    username: "",
    confirmUsername: "",
}

export const createTourInitial = {
    title: "",
    description: "",
}
export const createTourStopInitial = {
    description: "",
}

export const deleteAccountInitial = {
    password: "",
    reason: ""
}

export const createValidationSchema = (isEmail: boolean) => {
    const baseSchema = {
        firstName: yup
            .string()
            .required('First Name Required')
            .max(25, 'Maximum 15 Characters Allowed'),
        lastName: yup
            .string()
            .required('Last Name Required')
            .max(25, 'Maximum 15 Characters Allowed'),
    };
    if (isEmail) {
        baseSchema.email = yup
            .string()
            .required('Email Required')
            .email('Please provide a valid email address')
    } else {
        baseSchema.phone = yup
            .string()
            .required('Phone No Required').max(14, 'Phone number must be exactly 10 digits.').min(14, "Phone number must be exactly 10 digits.")
    }
    return yup.object().shape(baseSchema);
};

export const EditProfileValidation = (id: number) => {
    let baseSchema: any = {};
    if (id === 0) {
        baseSchema.firstName = yup
            .string()
            .required('First Name Required')
            .max(25, 'Maximum 25 Characters Allowed');
        baseSchema.lastName = yup
            .string()
            .required('Last Name Required')
            .max(25, 'Maximum 25 Characters Allowed');
    } else if (id === 1) {
        baseSchema.email = yup
            .string()
            .required('Email Required')
            .email('Please provide a valid email address');
    } else if (id === 3) {
        baseSchema.phone = yup
            .string()
            .required('Phone No Required')
            .max(14, 'Phone number must be exactly 10 digits.')
            .min(14, 'Phone number must be exactly 10 digits.');
    } else if (id === 2) {
        baseSchema.password = yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password Required')
            .max(25, 'Maximum 25 Characters Allowed');
        baseSchema.confirmPassword = yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Confirm Password Required')
            .oneOf([yup.ref('password')], 'Passwords do not match');
    }
    return yup.object().shape(baseSchema);
};

export const loginValidation = (isEmail: boolean) => {
    const loginScheme = {
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password Required').max(25, "Maximum 25 Characters Allowed"),
    }
    if (isEmail) {
        loginScheme.email = yup
            .string()
            .required('Email Required')
            .email('Please provide a valid email address')
    } else {
        loginScheme.phone = yup
            .string()
            .required('Phone No Required').max(14, 'Phone number must be exactly 10 digits.').min(14, "Phone number must be exactly 10 digits.")

    }
    return yup.object().shape(loginScheme)
}
export const forgotPassValidation = (isEmail: boolean) => {
    const loginScheme = {

    }
    if (isEmail) {
        loginScheme.email = yup
            .string()
            .required('Email Required')
            .email('Please provide a valid email address')
    } else {
        loginScheme.phone = yup
            .string()
            .required('Phone No Required').max(14, 'Phone number must be exactly 10 digits.').min(14, "Phone number must be exactly 10 digits.")

    }
    return yup.object().shape(loginScheme)
}



export const resetPasswordVal = yup.object().shape({
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password Required').max(25, "Maximum 25 Characters Allowed"),
    confirmPassword: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Confirm Password Required')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
});
export const deleteAccountValidation = yup.object().shape({
    password: yup
        .string()
        .required('Password Required').max(25, "Maximum 25 Characters Allowed"),
    reason: yup
        .string()
        .required('Reason Required'),
});

export const supportValidation = yup.object().shape({
    firstName: yup
        .string()
        .required('First Name Required')
        .max(25, 'Maximum 15 Characters Allowed'),
    lastName: yup
        .string()
        .required('Last Name Required')
        .max(25, 'Maximum 15 Characters Allowed'),
    email: yup
        .string()
        .required('Email Required')
        .email('Please provide a valid email address'),
    message: yup
        .string()
        .required('Message Required')
        .max(2000, 'Maximum limit reached'),
});



