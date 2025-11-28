// Debug utility to check localStorage and token
export const debugAuth = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('=== AUTH DEBUG ===');
    console.log('User from localStorage:', user);
    console.log('Token exists:', !!user?.token);
    console.log('Token value:', user?.token);
    console.log('User structure:', JSON.stringify(user, null, 2));
    console.log('=================');
    return user;
};

// Clear localStorage and force re-login
export const clearAuth = () => {
    localStorage.removeItem('user');
    console.log('✅ Auth cleared. Please refresh and login again.');
    window.location.href = '/';
};
