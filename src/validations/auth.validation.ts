const isEmpty = (value: string) => !value || value.trim().length === 0;

export const validateName = (name: string) => {
  if (isEmpty(name)) {
    return 'Name is required and cannot be empty';
  }
  if (name.length < 2 || name.length > 50) {
    return 'Name must be between 2 and 50 characters';
  }
  return null;
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (isEmpty(email)) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

export const validatePassword = (password: string) => {
  if (isEmpty(password)) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^\d{10,12}$/;
  if (isEmpty(phone)) {
    return 'Phone number is required';
  }
  if (!phoneRegex.test(phone)) {
    return 'Phone number must be between 10 and 15 digits';
  }
  return null;
};

export const validateIsDriver = (isDriver: boolean) => {
  if (typeof isDriver !== 'boolean') {
    return 'isDriver must be a boolean value';
  }
  return null;
};

export const validateRegisterInput = (input: any) => {
  const errors = [];

  const nameError = validateName(input.name);
  if (nameError) errors.push({ field: 'name', message: nameError });

  const emailError = validateEmail(input.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(input.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  const phoneError = validatePhone(input.phone);
  if (phoneError) errors.push({ field: 'phone', message: phoneError });

  const isDriverError = validateIsDriver(input.isDriver);
  if (isDriverError) errors.push({ field: 'isDriver', message: isDriverError });

  return errors;
};

export const validateLoginInput = (input: {
  email: string;
  password: string;
}) => {
  const errors = [];

  const emailError = validateEmail(input.email);
  if (emailError) errors.push({ field: 'email', message: emailError });

  const passwordError = validatePassword(input.password);
  if (passwordError) errors.push({ field: 'password', message: passwordError });

  return errors;
};
