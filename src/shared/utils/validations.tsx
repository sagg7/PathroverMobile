import * as yup from 'yup';

export const loginInitialObj = {
    email: "",
    password: ""
}
export const signupInitialObject = {
    email: "",
    name: ""
}
export const EditInitialObject = {
    username: "",
    profession: "",
    mobileNo: "",
    name: "",
    zipcode: ""
}
export const forgotPasswordInitialObject = {
    email: ""
}
export const forgotUsernameInitialObject = {
    mobileNo: ""
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

export const createValidationSchema = (role: any) => {
    const baseSchema = {
        email: yup
            .string()
            .required('Email Required')
            .email('Please provide a valid email address'),
        password: yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password Required')
            .max(25, 'Maximum 25 Characters Allowed'),

    };
    return yup.object().shape(baseSchema);
};
export const loginValidation = yup.object().shape({
    email: yup
        .string()
        .required('Email Required')
        .email('Please provide a valid email address'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password Required').max(25, "Maximum 25 Characters Allowed"),
});

export const forgotPassEmailValidation = yup.object().shape({
    email: yup
        .string()
        .required('Email Required')
        .email('Please provide a valid email address'),
});

export const forgotPassNumValidation = yup.object().shape({
    mobileNo: yup.string().required("Mobile Number Required").min(10, 'Mobile number must have atleast 10 digits').matches(/^\d+$/, 'Only Digits Allowed')
});

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



export const editValidationSchema = (role: any) => {
    const baseSchema = {
        username: yup
            .string()
            .required('Username Required')
            .matches(/^\S*$/, 'Space Not Allowed')
            .matches(/^[a-zA-Z0-9]*$/, 'Special Characters Are Not Allowed')
            .max(25, 'Maximum 25 Characters Allowed'),
        name: yup
            .string()
            .required('Name Required')
            .max(25, 'Maximum 25 Characters Allowed'),
        mobileNo: yup.string()
            .required('Mobile Number Required')
            .matches(/^\d+$/, 'Only Digits Allowed')
            .min(10, 'Mobile number must have at least 10 digits')
            .max(15, 'Maximum 15 digits allowed'),
        zipcode: yup
            .string()
            .min(4, 'Zipcode must have at least 4 characters').max(10, 'Maximum 10 Digits Allowed')
            .required('Zipcode Required'),
    };

    if (role === 'creator') {
        baseSchema.profession = yup.string().required('Profession Required');
    }

    return yup.object().shape(baseSchema);
};


