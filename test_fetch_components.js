async function testFetch() {
    try {
        const response = await fetch('http://localhost:5000/api/components');
        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testFetch();
