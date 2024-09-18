// pages/MyPage.tsx
import React from 'react';
import MyMDXEditor from '../components/MDXEditor'; // Ensure the path is correct

const MyPage = () => {
    return (
        <div>
            <h1>My Page with MDXEditor</h1>
            <MyMDXEditor markdown="# Hello from MyPage" />
        </div>
    );
};

export default MyPage;
